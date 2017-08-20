import './index.css';
import FileSaver from 'file-saver';
import convert from './conversion';

const makeDroppable = (element, callback) => {
  const triggerCallback = event => {
    if (event.dataTransfer) {
      callback(event.dataTransfer.files);
    } else if (event.target.files) {
      callback(event.target.files);
    }
  };

  const input = document.getElementById('input');

  input.addEventListener('change', triggerCallback);

  element.addEventListener('drop', event => {
    event.preventDefault();
    event.stopPropagation();
    triggerCallback(event);
  });

  element.addEventListener('click', () => {
    input.value = null;
    input.click();
  });
};

makeDroppable(document.querySelector('body'), fileList => {
  const file = fileList.item(0);
  const reader = new FileReader();
  reader.onload = event => {
    convert(event.target.result).then(xml => {
      FileSaver.saveAs(
        new Blob([xml], {type: 'text/plain;charset=utf-8'}),
        'KeePass.xml'
      );
    });
  };
  reader.readAsText(file);
});
