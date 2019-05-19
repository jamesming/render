import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import canvg from 'canvg';
import $ from 'jquery';
import { data3 } from '../data/data3.js';


const debugMode = true;
let debugBorder = 0;
const iframeWidth = 700;
const pictographrWidth  = data3.width;
const pictographrHeight  = data3.height;

// let widthRatio = (306 / pictographrWidth);
// let heightRatio = (395 / pictographrHeight);

const widthRatio = 0.23870;
const heightRatio = 0.23870;

const userCanvas = document.getElementById('userCanvas');
const buffer = .5;
userCanvas.style.width = `${((pictographrWidth ) * widthRatio) + buffer}px`;
userCanvas.style.height = `${((pictographrHeight ) * heightRatio) + buffer}px`;

if(debugMode){
  debugBorder = .25;
}


const createPDF = (canvasObj) => {

    document.getElementById('dom2print').appendChild(canvasObj);

    const pdfConf = {
        orientation: 'portrait',
        unit: 'pt',
        format: 'letter',
        pagesplit: false,
        background: '#fff',
      };

    const pdf = new jsPDF(pdfConf);
    pdf.html(
      document.getElementById('userCanvas'), {
      callback: function (pdf) {
        var iframe2 = document.createElement('iframe');
        iframe2.setAttribute('style', `margin-right:20px;position:absolute;right:50px; bottom:0; height:50%; width:${iframeWidth}px`);
        document.body.appendChild(iframe2);
        iframe2.src = pdf.output('datauristring');
        // pdf.save('printedPDF.pdf');
      }
    });

};

const createPNG = (canvasObj) => {
  const img64 = canvasObj.toDataURL("image/png");
  const img = document.createElement("img");
  img.src = img64;
  img.style.width = '100%';

  const iframe = document.createElement('iframe');
  iframe.setAttribute('style', `margin-right:20px;position:absolute;right:50px; top:0;height:50%; width:${iframeWidth}px`);
  document.body.appendChild(iframe);
  $('iframe').contents().find('body').append(img);
};


const createDiv = ({x, y, width, height}) => {
  return ` <div style='
              position: absolute;
              top: ${y}px;
              left: ${x}px;
              width: ${width}px;
              height: ${height}px;
              border: ${debugBorder}px solid gray;'>
            </div>`;
};

const doLayout = () => {

  let fooArray = [];
  let idx = 10;
  const max = 150;
  while(idx < max){
    idx += 10;
    fooArray.push(idx);
  };

  let componentsArray = [];

  const buildElements = () => {

    const elements = data3.data.elements;

    const createElements = elements.map((element)=>{
      return {
          top: parseFloat(element.style.element.top),
          left: parseFloat(element.style.element.left),
          width: parseFloat(element.style.element.width),
          height: parseFloat(element.style.element.height),
      };
    });

    return createElements.map((element)=>{
      return createDiv({
        x: element.left * widthRatio,
        y: element.top * heightRatio,
        width: element.width * widthRatio,
        height: element.height * heightRatio,
      });
    });

  };

  componentsArray = buildElements();
  return componentsArray.join("");
};

userCanvas.innerHTML = `
  <div
    style='
    position: absolute;
    left: ${buffer}px;
    top: ${buffer}px;
    width: ${(pictographrWidth * widthRatio)}px;
    height: ${(pictographrHeight * heightRatio)}px;
    border: ${debugBorder}px solid gray;
  '>${doLayout()}
  </div>
`;

html2canvas( userCanvas )
  .then(
    canvasObj => {
      createPNG(canvasObj);
      createPDF(canvasObj);
    }
  );

