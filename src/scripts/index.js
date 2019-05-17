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
    console.log(`data2: `, JSON.stringify(data2, null, 2));
    console.log(`canvasObj: `, canvasObj);

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
  return `
      <div
        style='
          position: absolute;
          top: ${x}px;
          left: ${y}px;
          width: ${width}px;
          height: ${height}px;
          border: .25px solid gray;
          background: red;
      '></div>
  `;
};

canvas.innerHTML = `
  <div
    style='
    width: 304px;
    height: 393px;
    border: .25px solid gray;
  '>${createDiv({
    x: 10,
    y: 10,
    width: 100,
    height: 100,
  })}
  </div>
`;

html2canvas( canvas )
  .then(
    canvasObj => {
      createPNG(canvasObj);
      createPDF(canvasObj);

    }
  );

