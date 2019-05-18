import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import canvg from 'canvg';
import $ from 'jquery';
import { data2 } from '../data/data2.js';


const iframeWidth = 700;

const createPDF = (canvasObj) => {

    // canvasObj.width = 638;
    // canvasObj.height = 825;

    // canvasObj.setAttribute('width', 638);
    // canvasObj.setAttribute('height', 825);

    // var ctx = canxvas.getContext("2d");
    // ctx.width = 638;
    // ctx.height = 825;
    // console.clear();
    // console.log(`data2: `, JSON.stringify(data2, null, 2));
    // console.log(`canvasObj: `, canvasObj);

    document.getElementById('dom2print').appendChild(canvasObj);
/*
    var canvas = document.querySelector("canvas");
    console.log(`canvas.width: `, canvas.width);
    // canvas.height = '300px';
    canvas.width = 638;
    canvas.height = 825;
*/
    // console.log(canvas);

    const pdfConf = {
        orientation: 'portrait',
        unit: 'pt',
        format: 'letter',
        pagesplit: false,
        background: '#fff',
      };

    const pdf = new jsPDF(pdfConf);
    pdf.html(
      document.querySelector("canvas"), {
      // width: 20,
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

const canvas = document.getElementById('userCanvas');

const createDiv = ({x, y, width, height}) => {
  return ` <div style='
              position: absolute;
              top: ${y}px;
              left: ${x}px;
              width: ${width}px;
              height: ${height}px;
              border: .25px solid gray;'>
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

    const dataWidth  = data2.width;
    const dataHeight  = data2.height;

    // let widthRatio = (306 / dataWidth);
    // let heightRatio = (395 / dataHeight);

    const shrinkage = .994;
    const widthRatio = 0.24 * shrinkage;
    const heightRatio = 0.23939393939393938 * shrinkage;

    canvas.style.width = dataWidth * widthRatio;
    canvas.style.height = dataHeight * heightRatio;

    // console.log(`{widthRatio, heightRatio}: `, JSON.stringify({widthRatio, heightRatio}, null, 2));

    const elements = data2.data.elements;

    console.log(`elements: `, JSON.stringify(elements, null, 2));

    const renderElements = elements.map((element)=>{
      return {
          top: parseFloat(element.style.element.top),
          left: parseFloat(element.style.element.left),
          width: parseFloat(element.style.element.width),
          height: parseFloat(element.style.element.height),
      };
    });

    // console.log(`renderElements: `, JSON.stringify(renderElements, null, 2));

    return renderElements.map((element)=>{
      console.log(`element.left: `, element.left);
      return createDiv({
        x: element.left * widthRatio,
        y: element.top * heightRatio,
        width: element.width * widthRatio,
        height: element.height * heightRatio,
      });
    });


  };

  componentsArray = buildElements();

  console.log(`componentsArray: `, JSON.stringify(componentsArray, null, 2));

  // const componentsArray = fooArray.map((foo)=>{
  //   return createDiv({
  //     x: foo,
  //     y: foo,
  //     width: foo,
  //     height: foo,
  //   });
  // });

  return componentsArray.join("");
};

canvas.innerHTML = `
  <div
    style='
    width: 304px;
    height: 393px;
    border: .25px solid gray;
  '>${doLayout()}
  </div>
`;

html2canvas( canvas )
  .then(
    canvasObj => {
      createPNG(canvasObj);
      createPDF(canvasObj);

    }
  );

