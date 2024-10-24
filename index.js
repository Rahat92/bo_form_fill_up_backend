// const express = require('express');
// const { PDFDocument, rgb } = require('pdf-lib'); // Import pdf-lib

// const app = express();

// app.get('/generate-pdf', async (req, res) => {
//   try {
//     // Create a new PDF document
//     const pdfDoc = await PDFDocument.create();

//     // Add a blank page to the document
//     const page = pdfDoc.addPage([600, 400]);

//     // Draw text on the page
//     const { width, height } = page.getSize();
//     page.drawText('Hello, this is your PDF!', {
//       x: 50,
//       y: height - 50,
//       size: 24,
//       color: rgb(0, 0, 0.75),
//     });

//     // Serialize the PDF document to bytes (Uint8Array)
//     const pdfBytes = await pdfDoc.save();

//     // Set response headers for downloading PDF
//     res.set({
//       'Content-Type': 'application/pdf',
//       'Content-Disposition': 'attachment; filename=generated.pdf',
//     });

//     // Send the generated PDF
//     res.send(Buffer.from(pdfBytes));
//   } catch (error) {
//     console.error('Error generating PDF:', error);
//     res.status(500).send('Error generating PDF');
//   }
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });



// const express = require('express');
// const { PDFDocument, rgb } = require('pdf-lib'); // Import pdf-lib

// const app = express();

// app.get('/preview-pdf', async (req, res) => {
//   try {
//     // Create a new PDF document
//     const pdfDoc = await PDFDocument.create();

//     // Add a blank page to the document
//     const page = pdfDoc.addPage([600, 400]);

//     // Draw text on the page
//     const { width, height } = page.getSize();
//     page.drawText('Hello, this is your PDF preview!', {
//       x: 50,
//       y: height - 50,
//       size: 24,
//       color: rgb(0, 0, 0.75),
//     });

//     // Serialize the PDF document to bytes (Uint8Array)
//     const pdfBytes = await pdfDoc.save();

//     // Set response headers for inline preview in the browser
//     const fileName = 'example-preview.pdf'; // You can dynamically set this based on request data
//     res.set({
//       'Content-Type': 'application/pdf',
//       'Content-Disposition': `inline; filename=${fileName}`, // Display in browser
//     });

//     // Send the generated PDF
//     res.send(Buffer.from(pdfBytes));
//   } catch (error) {
//     console.error('Error generating PDF:', error);
//     res.status(500).send('Error generating PDF');
//   }
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });




const express = require('express');
const regeneratorRuntime = require("regenerator-runtime");

const cors = require('cors')
const { PDFDocument, rgb, setCharacterSpacing } = require('pdf-lib'); // Import pdf-lib
const fontKit = require('@pdf-lib/fontkit')
const fs = require('fs'); // For reading the existing PDF file
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
    const secondPage = pages[1]; // Modify this page or loop through other pages

    // Modify the page (e.g., add text)
    const { width, height } = firstPage.getSize();
    // firstPage.drawText('Modified Text Example!', {
    //   x: 50,
    //   y: height - 100, 
    //   size: 8,
    //   color: rgb(1, 0, 0), // Red color
    //   characterSpacing: 5
    // });






    // const dob = '1-1-97';
    // let x = 50;  // Starting position for the text
    // const y = 700;  // Vertical position for the text
    // const size = 10;
    // const spacing = 5.02;  // Adjust this for letter spacing

    // // Draw each character with spacing
    // for (let i = 0; i < name.length; i++) {
    //   firstPage.drawText(name[i], {
    //     x: x,
    //     y: height - 307.8,
    //     size: size,
    //     color: rgb(0, 0, 0),
    //   });
    //   // Increase x position for the next character
    //   x += size + spacing; 
    // }

    const fontBytes = fs.readFileSync(__dirname + "/fonts/NotoSansSymbols-Regular.ttf");
    const bengliFontBytes = fs.readFileSync(__dirname + "/fonts/SutonnySushreeMJ-Italic.ttf");
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
    const text = 'ডিজাইন গুলি';
    let xPosition = 50; // Starting x position

    for (const char of text) {
      firstPage.drawText(char, {
        x: xPosition,
        y: 350,
        size: 24,
        font: customFontBengli,
        color: rgb(0, 0, 0),
      });
      xPosition += 20; // Adjust the spacing value as needed
    }

    secondPage.drawText('আমার সোনার বাংলা', {
      x: 0,
      y: 500,
      size: 24,
      font: customFontBengli,
      color: rgb(0, 0, 0),
    });
    // account holder name
    generateAndPlaceText(firstPage, 'name', req.body.clientName, 51, 307.8, 10, { r: 0, g: 0, b: 0 }, 4.8, '');

    // Date of birth
    generateAndPlaceText(firstPage, 'name', req.body.clientDateOfBirth, 445, 664.5, 9, { r: 0, g: 0, b: 0 }, 5.1, '');

    // occupation
    generateAndPlaceText(firstPage, 'name', req.body.clientOccupation, 330, 345, 10, { r: 0, g: 0, b: 0 }, undefined, '');

    // father/husband name
    generateAndPlaceText(firstPage, 'name', req.body.clientGuardian, 145, 363, 10, { r: 0, g: 0, b: 0 }, undefined, '');

    // mother name
    generateAndPlaceText(firstPage, 'name', req.body.clientMother, 110, 382, 10, { r: 0, g: 0, b: 0 }, undefined, '');

    // address
    generateAndPlaceText(firstPage, 'name', req.body.clientAddress, 90, 430, 10, { r: 0, g: 0, b: 0 }, 0, '')

    // city
    generateAndPlaceText(firstPage, 'name', req.body.clientCity, 70, 445, 10, { r: 0, g: 0, b: 0 }, 0, '')

    // postal code
    generateAndPlaceText(firstPage, 'name', req.body.clientPostalCode, 195, 445, 10, { r: 0, g: 0, b: 0 }, 0, '')

    // country
    generateAndPlaceText(firstPage, 'name', req.body.clientCountry, 375, 445, 10, { r: 0, g: 0, b: 0 }, 0, '')

    // mobile
    generateAndPlaceText(firstPage, 'name', req.body.clientMobileNumber, 98, 465, 10, { r: 0, g: 0, b: 0 }, 0, '')

    // email
    generateAndPlaceText(firstPage, 'name', req.body.clientEmail, 285, 465, 10, { r: 0, g: 0, b: 0 }, 0, '')

    // nid
    generateAndPlaceText(firstPage, 'name', req.body.clientNid, 155, 720, 10, { r: 0, g: 0, b: 0 }, 0, '')

    // bank name
    generateAndPlaceText(firstPage, 'name', 'Commercial Bank Of Ceylon PLC', 90, 575, 10, { r: 0, g: 0, b: 0 }, 0, '')

    // branch name
    generateAndPlaceText(firstPage, 'name', 'Progoti Sharani SME', 310, 575, 10, { r: 0, g: 0, b: 0 }, 0, '')

    // routing number
    generateAndPlaceText(firstPage, 'name', '080271512', 105, 555, 10, { r: 0, g: 0, b: 0 }, 0, '')

    // bank account number
    generateAndPlaceText(firstPage, 'name', '8813002586', 335, 555, 10, { r: 0, g: 0, b: 0 }, 0, '')

    // firstPage.drawText('\u2713', {
    //   // x: 127,   // X position
    //   // x: 188,
    //   x: 246,
    //   y: height - 142,   // Y position
    //   font: customFont,
    //   size: 20, // Adjust size if needed
    //   color: rgb(0, 0, 0), // Green color for the tick mark
    // });
    // generateAndPlaceText(firstPage, 'tickMark', '\u2713', 246, 142, 30, { r: 0, g: 0, b: 0 }, undefined, '')
    // firstPage.drawText('\u2713', {
    //   // x:393,
    //   // x:455,
    //   x: 530,
    //   y: height - 142,   // Y position
    //   font: customFont,
    //   size: 20, // Adjust size if needed
    //   color: rgb(0, 0, 0), // Green color for the tick mark
    // });

    // bo type
    generateAndPlaceText(firstPage, 'tickMark', '\u2713', req.body.boType === 'single' ? 393 : req.body.boType === 'joint' ? 530 : 455, 142, 30, { r: 0, g: 0, b: 0 }, undefined, '')

    // gender
    const male = false;
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


// // create multiple page


// const express = require('express');
// const { PDFDocument, rgb } = require('pdf-lib');

// const app = express();

// app.get('/multi-page-pdf', async (req, res) => {
//   try {
//     // Create a new PDF document
//     const pdfDoc = await PDFDocument.create();

//     // Add the first page
//     const page1 = pdfDoc.addPage([600, 400]);
//     page1.drawText('This is page 1!', {
//       x: 50,
//       y: 10,
//       size: 24,
//       color: rgb(0.2, 0.84, 0.67),
//     });
//     page1.drawText('Second line in page 1', {
//       x: 50,
//       y: 40,
//       size: 24,
//       color: rgb(0.2, 0.84, 0.67),
//     });
//     page1.drawText('Third line in page 1', {
//       x: 50,
//       y: 70,
//       size: 24,
//       color: rgb(0.2, 0.84, 0.67),
//     });

//     // Add a second page
//     const page2 = pdfDoc.addPage([600, 400]);
//     page2.drawText('Welcome to page 2!', {
//       x: 50,
//       y: 350,
//       size: 24,
//       color: rgb(0.1, 0.1, 0.75),
//     });

//     // Add a third page
//     const page3 = pdfDoc.addPage([600, 400]);
//     page3.drawText('This is the last page (Page 3)!', {
//       x: 50,
//       y: 350,
//       size: 24,
//       color: rgb(1, 0, 0),
//     });

//     // Serialize the PDF document to bytes
//     const pdfBytes = await pdfDoc.save();

//     // Set response headers for inline preview in the browser
//     const fileName = 'multi-page-preview.pdf';
//     res.set({
//       'Content-Type': 'application/pdf',
//       'Content-Disposition': `inline; filename=${fileName}`, // Display in browser
//     });

//     // Send the generated PDF
//     res.send(Buffer.from(pdfBytes));
//   } catch (error) {
//     console.error('Error generating PDF:', error);
//     res.status(500).send('Error generating PDF');
//   }
// });

// // Start the server
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
