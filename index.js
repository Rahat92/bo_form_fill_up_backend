const express = require('express');
const axios = require('axios')
const regeneratorRuntime = require("regenerator-runtime");

const cors = require('cors')
const { PDFDocument, rgb, setCharacterSpacing } = require('pdf-lib'); // Import pdf-lib
const fontKit = require('@pdf-lib/fontkit')
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json())
app.use(cors({ origin: '*' }))

app.post('/modify-pdf', async (req, res) => {
  console.log(req.body)
  try {
    // Load the existing PDF file from the file system
    const existingPdfBytes = fs.readFileSync(__dirname + "/BO_Account_Open_Form.pdf"); // Update with your file path

    // Load the PDF into pdf-lib
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    pdfDoc.registerFontkit(fontKit)
    // Get the first page of the existing PDF (or another page if needed)
    const pages = pdfDoc.getPages();
    const firstPage = pages[0]; // Modify this page or loop through other pages
    const { width, height } = firstPage.getSize();
    const secondPage = pages[1]; // Modify this page or loop through other pages
    const { width: secondPageWidth, height: secondPageHeight } = secondPage.getSize();
    const fetchImage = async (url) => {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      return response.data;
    };
    if (req.body.clientPhoto) {
      const imageBytes = await fetchImage(req.body.clientPhoto);

      let image;

      try {
        image = await pdfDoc.embedPng(imageBytes); // Try to embed as PNG
      } catch (error) {
        image = await pdfDoc.embedJpg(imageBytes); // Fallback to JPG
      }
      secondPage.drawImage(image, {
        x: 92, // Position the image
        y: secondPageHeight - 460.5, // Position from the top
        width: 102,
        height: 105
      })
    }

    if (req.body.clientSignature) {
      const signatureBytes = await fetchImage(req.body.clientSignature)
      let signature;
      try {
        signature = await pdfDoc.embedPng(signatureBytes); // Try to embed as PNG
      } catch (error) {
        signature = await pdfDoc.embedJpg(signatureBytes); // Fallback to JPG
      }
      secondPage.drawImage(signature, {
        x: 400, // Position the image
        y: secondPageHeight - 649.5, // Position from the top
        width: 102,
        height: 26
      })
    }


    if (req.body.jointApplicantPhoto) {
      const jointApplicantPhotoBytes = await fetchImage(req.body.jointApplicantPhoto)
      let jointApplicantPhoto;
      try {
        jointApplicantPhoto = await pdfDoc.embedPng(jointApplicantPhotoBytes); // Try to embed as PNG
      } catch (error) {
        jointApplicantPhoto = await pdfDoc.embedJpg(jointApplicantPhotoBytes); // Fallback to JPG
      }
      secondPage.drawImage(jointApplicantPhoto, {
        x: 263, // Position the image
        y: secondPageHeight - 460.5, // Position from the top
        width: 102,
        height: 105
      })
    }

    const fontBytes = fs.readFileSync(__dirname + "/fonts/NotoSansSymbols-Regular.ttf");
    const bengliFontBytes = fs.readFileSync(__dirname + "/fonts/Shonar.ttf");
    const customFont = await pdfDoc.embedFont(fontBytes);
    const customFontBengli = await pdfDoc.embedFont(bengliFontBytes);
    const generateAndPlaceText = (page, type, content, x, y, size, color, spacing, font) => {
      // Draw each character with spacing
      if (type === 'name' && spacing > 0) {
        for (let i = 0; i < content.length; i++) {
          page.drawText(content[i], {
            x: x,
            y: height - y,
            size: size,
            font: customFontBengli,
            color: rgb(color.r, color.g, color.b),
          });
          // Increase x position for the next character
          if (spacing > 0) {
            x += size + spacing;
          } else {
            x += size - 3
          }
        }
      } else if (type === 'name' && spacing === 0) {
        page.drawText(content, {
          // x: 127,   // X position
          // x: 188,
          x: x,
          y: height - y,   // Y position
          size: size, // Adjust size if needed
          color: rgb(color.r, color.g, color.b), // Green color for the tick mark
        });

      } else if (type !== 'name') {
        page.drawText(content, {
          x: x,
          y: height - y,
          size: size - 8,
          font: customFont,
          color: rgb(color.r, color.g, color.b), // Red color
        });
      } else {
        page.drawText(content, {
          x: x,
          y: height - y,
          size: size,
          color: rgb(color.r, color.g, color.b), // Red color
        });
      }
    }

    // account holder name
    if(req.body.clientName){
      generateAndPlaceText(firstPage, 'name', req.body.clientName, 51, 307.8, 10, { r: 0, g: 0, b: 0 }, 4.8, '');
      generateAndPlaceText(secondPage, 'name', req.body.clientName, 150, 640.8, 12, { r: 0, g: 0, b: 0 }, 0, '');
    }

    if(req.body.jointApplicantName){
      generateAndPlaceText(secondPage, 'name', req.body.jointApplicantName, 150, 665.8, 12, { r: 0, g: 0, b: 0 }, 0, '');
      generateAndPlaceText(firstPage, 'name', req.body.jointApplicantName, 153, 805.8, 10, { r: 0, g: 0, b: 0 }, 0, '');
    }
    

    // Date of birth
    if(req.body.clientDateOfBirth){
      generateAndPlaceText(firstPage, 'name', req.body.clientDateOfBirth, 445, 664.5, 9, { r: 0, g: 0, b: 0 }, 5.1, '');
    }

    // occupation
    if(req.body.clientOccupation){
      generateAndPlaceText(firstPage, 'name', req.body.clientOccupation, 330, 345, 10, { r: 0, g: 0, b: 0 }, undefined, '');
    }

    // father/husband name
    if(req.body.clientGuardian){
      generateAndPlaceText(firstPage, 'name', req.body.clientGuardian, 145, 363, 10, { r: 0, g: 0, b: 0 }, undefined, '');
    }

    // mother name
    if(req.body.clientMother){
      generateAndPlaceText(firstPage, 'name', req.body.clientMother, 110, 382, 10, { r: 0, g: 0, b: 0 }, undefined, '');
    }

    // address
    if(req.body.clientAddress){
      generateAndPlaceText(firstPage, 'name', req.body.clientAddress, 90, 430, 10, { r: 0, g: 0, b: 0 }, 0, '')
    }

    // city
    if(req.body.clientCity){
      generateAndPlaceText(firstPage, 'name', req.body.clientCity, 70, 445, 10, { r: 0, g: 0, b: 0 }, 0, '')
    }

    // postal code
    if(req.body.clientPostalCode){
      generateAndPlaceText(firstPage, 'name', req.body.clientPostalCode, 195, 445, 10, { r: 0, g: 0, b: 0 }, 0, '')
    }

    // country
    if(req.body.clientCountry){
      generateAndPlaceText(firstPage, 'name', req.body.clientCountry, 375, 445, 10, { r: 0, g: 0, b: 0 }, 0, '')
    }

    // mobile
    if(req.body.clientMobileNumber){
      generateAndPlaceText(firstPage, 'name', req.body.clientMobileNumber, 96, 465, 10, { r: 0, g: 0, b: 0 }, 0, '')
    }

    // email
    if(req.body.clientEmail){
      generateAndPlaceText(firstPage, 'name', req.body.clientEmail, 285, 465, 10, { r: 0, g: 0, b: 0 }, 0, '')
    }

    // nid
    if(req.body.clientNid){
      generateAndPlaceText(firstPage, 'name', req.body.clientNid, 155, 720, 10, { r: 0, g: 0, b: 0 }, 0, '')
    }

    // bank name
    if(req.body.clientBankName){
      generateAndPlaceText(firstPage, 'name', req.body.clientBankName, 90, 575, 10, { r: 0, g: 0, b: 0 }, 0, '')
    }

    // branch name
    generateAndPlaceText(firstPage, 'name', 'Progoti Sharani SME', 310, 575, 10, { r: 0, g: 0, b: 0 }, 0, '')

    // routing number
    generateAndPlaceText(firstPage, 'name', '080271512', 105, 555, 10, { r: 0, g: 0, b: 0 }, 0, '')

    // bank account number
    generateAndPlaceText(firstPage, 'name', '8813002586', 335, 555, 10, { r: 0, g: 0, b: 0 }, 0, '')

    // bo type
    generateAndPlaceText(firstPage, 'tickMark', '\u2713', 127, 142, 30, { r: 0, g: 0, b: 0 }, undefined, '')
    generateAndPlaceText(firstPage, 'tickMark', '\u2713', req.body.boType === 'single' ? 393 : req.body.boType === 'joint' ? 530 : 455, 142, 30, { r: 0, g: 0, b: 0 }, undefined, '')

    // gender
    generateAndPlaceText(firstPage, 'tickMark', '\u2713', req.body.clientGender === 'Male' ? 166 : 212, 340, 30, { r: 0, g: 0, b: 0 }, undefined, '')

    // Resident
    const resident = false;
    generateAndPlaceText(firstPage, 'tickMark', '\u2713', resident ? 125 : 188, 659, 30, { r: 0, g: 0, b: 0 }, undefined, '')

    // Nationallity
    generateAndPlaceText(firstPage, 'name', req.body.clientNationality, 250, 659, 10, { r: 0, g: 0, b: 0 }, 0, '')


    // Serialize the modified PDF document to bytes
    const modifiedPdfBytes = await pdfDoc.save();

    // Set response headers for inline preview in the browser
    const fileName = 'modified-preview.pdf'; // File name for preview
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename=${fileName}`, // Display in browser
    });

    // Send the modified PDF for preview
    res.send(Buffer.from(modifiedPdfBytes));
  } catch (error) {
    console.error('Error modifying PDF:', error);
    res.status(500).send('Error modifying PDF');
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});