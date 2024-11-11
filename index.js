const express = require('express');
const axios = require('axios')
const officegen = require('officegen');
const { AlignmentType, Document, Footer, Header, HeadingLevel, Packer, Paragraph, TextRun, UnderlineType, Table, TableCell, TableRow, addLineBreak } = require('docx');

const cors = require('cors')
const { PDFDocument, rgb, setCharacterSpacing } = require('pdf-lib'); // Import pdf-lib
const fontKit = require('@pdf-lib/fontkit')
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json())
app.use(cors({ origin: ["http://157.142.6.2:8082", "http://localhost:3000", "http://157.142.6.2:8080", "http://localhost:8080"] }))
app.post('/modify-pdf', async (req, res) => {

  function placeWordAtFixedColumn(line, word, column) {
    // Ensure the line has enough spaces to reach the desired column
    if (line.length < column - 1) {
      line += " ".repeat(column - 1 - line.length);
    }
    
    // Place the word at the exact column position
    line = line.slice(0, column - 1) + word + line.slice(column - 1 + word.length);
    
    return line;
  }
  
  // Start with an empty line
  let line01 = "";
  
  // Add words at specified absolute column positions
  line01 = placeWordAtFixedColumn(line01, "Hello", 1);
  line01 = placeWordAtFixedColumn(line01, "world", 16);
  line01 = placeWordAtFixedColumn(line01, "How", 31);
  line01 = placeWordAtFixedColumn(line01, "", 40);
  let line02 = "";
  
  // Add words at specified absolute column positions
  line02 = placeWordAtFixedColumn(line02, "Hello", 1);
  line02 = placeWordAtFixedColumn(line02, "world", 16);
  line02 = placeWordAtFixedColumn(line02, "How", 31);
  
  // Write the line to a text file
  fs.writeFile("FixedColumnText.11", line01+"\n"+line02+"\n", (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return;
    }
    console.log("Text file created with words at fixed columns.");
  });
  // Generate Text file
  const testWord = "Rahatt"
  const rootFolder = 'C:\\Users\\ASUS\\Desktop\\BO'
  const folderName = req.body.clientId;
  const text = `0000007Admin 018900\n` +
    `01000001\n` +
    `02YYG10042${" ".repeat(130)}1121001678104${" ".repeat(3)}Y140261725${" ".repeat(123)}\n` +
    `030101BAN25081990${" ".repeat(40)}F${" ".repeat(25)}\n` +
    `04MUKTA${" ".repeat(125)}AKTER${" ".repeat(25)}MUKTA AKTER${" ".repeat(109)}TA-200/1 SOUTH BADDA${" ".repeat(10)}GULSHAN.DHAKA-1212${" ".repeat(42)}DHAKA${" ".repeat(20)}DHAKA${" ".repeat(20)}BANGLADESH${" ".repeat(15)}1212${" ".repeat(6)}01985336212${" ".repeat(49)}mdmahabuburrahmansir@gmail.com${" ".repeat(50)}MOHAMMAD MAHABUBUR RAHMAN${" ".repeat(5)}MOJIDA BEGUM${" ".repeat(89)}YHOUSE WIFE${" ".repeat(20)}9104812590${" ".repeat(10)}\n` +
    `05${" ".repeat(240)}\n` +
    `06${" ".repeat(240)}\n` +
    `070101G100420101.jpg${" ".repeat(36)}\n`
    ;


  // fs.readFile("FixedSpaceText.txt", "utf8", (err, data) => {
  //   if (err) {
  //     console.error("Error reading file:", err);
  //     return;
  //   }
    
  //   const lineCount = data.split(/\r?\n/).length;
     
  // });
  let docx = officegen('docx')

  // Officegen calling this function after finishing to generate the docx document:
  docx.on('finalize', function (written) {
    console.log(
      'Finish to create a Microsoft Word document.'
    )
  })

  // Officegen calling this function to report errors:
  docx.on('error', function (err) {
    console.log(err)
  })


  // Create a new paragraph:
  let pObj = docx.createP()
  pObj.addText(`SUBMITTED INFORMATION: ${folderName}`, {
    bold: true,
    undefined: true
  })
  pObj = docx.createP()

  Object.keys(req.body.fields).forEach((item, index) => {
    pObj.addText(Object.keys(req.body.fields)[index], {
      bold: true,
      underline: true
    })
    pObj.addLineBreak()
    pObj.addText(Object.values(req.body.fields)[index])
    pObj = docx.createP()
  })


  // // pObj.addText(' and back color.', { color: '00ffff', back: '000088' })



  // pObj.addText('Since ')
  // pObj.addText('officegen 0.2.12', {
  //   back: '00ffff',
  //   shdType: 'pct12',
  //   shdColor: 'ff0000'
  // }) // Use pattern in the background.
  // pObj.addText(' you can do ')
  // pObj.addText('more cool ', { highlight: true }) // Highlight!
  // pObj.addText('stuff!', { highlight: 'darkGreen' }) // Different highlight color.

  // pObj = docx.createP()

  // pObj.addText('Even add ')
  // pObj.addText('external link', { link: 'https://github.com' })
  // pObj.addText('!')

  // pObj = docx.createP()

  // pObj.addText('Bold + underline', { bold: true, underline: true })

  // pObj = docx.createP({ align: 'center' })

  // pObj.addText('Center this text', {
  //   border: 'dotted',
  //   borderSize: 12,
  //   borderColor: '88CCFF'
  // })

  // pObj = docx.createP()
  // pObj.options.align = 'right'

  // pObj.addText('Align this text to the right.')

  // pObj = docx.createP()

  // pObj.addText('Those two lines are in the same paragraph,')
  // pObj.addLineBreak()
  // pObj.addText('but they are separated by a line break.')

  // docx.putPageBreak()

  // pObj = docx.createP()

  // pObj.addText('Fonts face only.', { font_face: 'Arial' })
  // pObj.addText(' Fonts face and size.', { font_face: 'Arial', font_size: 40 })

  // docx.putPageBreak()

  // pObj = docx.createP()

  // // We can even add images:
  // pObj.addImage('images/M0123.png')

  // Let's generate the Word document into a file:

  let out = fs.createWriteStream(`${rootFolder}\\${folderName}\\${folderName}.docx`)

  out.on('error', function (err) {
    console.log(err)
  })

  // Async call to generate the output file:
  docx.generate(out)


  const getFileExtension = (fileName) => {
    const fileExtension = fileName.split('.')[fileName.split('.').length - 1];
    return fileExtension;
  }
  console.log(req.body)
  if (!fs.existsSync(`${rootFolder}\\${folderName}`)) {
    fs.mkdirSync(path.join(`${rootFolder}`, folderName), (err) => {
      if (err) {
        console.log(err)
      } else {
        console.log('Folder is written')
      }
    })
  } else {

    return res.status(400).json({
      status: 'Fail',
      message: 'Already exist a folder with same name'
    })
  }
  try {
    const existingPdfBytes = fs.readFileSync(__dirname + "/BO_Account_Open_Form.pdf"); // Update with your file path

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
      fs.writeFile(`${rootFolder}\\${folderName}/${folderName}-photo.jpg`, imageBytes, err => {
        if (err) {
          console.log(err)
        }
      })
      let image;
      try {
        image = await pdfDoc.embedPng(imageBytes);
      } catch (error) {
        console.error('Error embedding PNG:', error);
        try {
          image = await pdfDoc.embedJpg(imageBytes);
        } catch (error) {
          console.error('Error embedding JPG:', error);
          throw new Error('Failed to embed image as either PNG or JPG.');
        }
      }
      secondPage.drawImage(image, {
        x: 92,
        y: secondPageHeight - 460.5,
        width: 102,
        height: 105
      })
    }

    if (req.body.clientSignature) {
      const signatureBytes = await fetchImage(req.body.clientSignature)
      fs.writeFile(`${rootFolder}\\${folderName}/${folderName}-signature.jpg`, signatureBytes, err => {
        if (err) {
          console.log(err)
        }
      })
      let signature;
      try {
        signature = await pdfDoc.embedPng(signatureBytes); // Try to embed as PNG
      } catch (error) {
        signature = await pdfDoc.embedJpg(signatureBytes); // Fallback to JPG
      }
      secondPage.drawImage(signature, {
        x: 400, // Position the image
        y: secondPageHeight - 645.5, // Position from the top
        width: 102,
        height: 19
      })
    }
    if (req.body.clientNidPhoto) {
      const fileExtension = getFileExtension(req.body.clientNidPhoto)
      const clientNidPhotoBytes = await fetchImage(req.body.clientNidPhoto)

      fs.writeFile(`${rootFolder}\\${folderName}/${folderName}-client-nid.${fileExtension}`, clientNidPhotoBytes, err => {
        if (err) {
          console.log(err)
        }
      })
    }
    if (req.body.clientNominyPhoto) {
      const fileExtension = getFileExtension(req.body.clientNominyPhoto)

      const clientNomineePhotoBytes = await fetchImage(req.body.clientNominyPhoto)
      fs.writeFile(`${rootFolder}\\${folderName}/${folderName}-client-nominee.${fileExtension}`, clientNomineePhotoBytes, err => {
        if (err) {
          console.log(err)
        }
      })
    }
    if (req.body.jointApplicantSign) {
      const fileExtension = getFileExtension(req.body.jointApplicantSign)

      const jointApplicantSignatureBytes = await fetchImage(req.body.jointApplicantSign)
      fs.writeFile(`${rootFolder}\\${folderName}/${folderName}-joint-applicant-sign.${fileExtension}`, jointApplicantSignatureBytes, err => {
        if (err) {
          console.log(err)
        }
      })
      let jointApplicantSignature;
      try {
        jointApplicantSignature = await pdfDoc.embedPng(jointApplicantSignatureBytes); // Try to embed as PNG
      } catch (error) {
        jointApplicantSignature = await pdfDoc.embedJpg(jointApplicantSignatureBytes); // Fallback to JPG
      }
      secondPage.drawImage(jointApplicantSignature, {
        x: 400, // Position the image
        y: secondPageHeight - 669, // Position from the top
        width: 102,
        height: 18
      })
    }

    if (req.body.jointApplicantPhoto) {
      const fileExtension = getFileExtension(req.body.jointApplicantPhoto)

      const jointApplicantPhotoBytes = await fetchImage(req.body.jointApplicantPhoto)

      fs.writeFile(`${rootFolder}\\${folderName}/${folderName}-joint-applicant-photo.${fileExtension}`, jointApplicantPhotoBytes, err => {
        if (err) {
          console.log(err)
        }
      })
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

    if (req.body.clientBankDepositeScreenShot) {
      const fileExtension = getFileExtension(req.body.clientBankDepositeScreenShot)

      const clientBankDepositePhotoBytes = await fetchImage(req.body.clientBankDepositeScreenShot)

      fs.writeFile(`${rootFolder}\\${folderName}/${folderName}-bank-deposite-screenshot.${fileExtension}`, clientBankDepositePhotoBytes, err => {
        if (err) {
          console.log(err)
        }
      })
    }



    const fontBytes = fs.readFileSync(__dirname + "/fonts/NotoSansSymbols-Regular.ttf");
    const bengliFontBytes = fs.readFileSync(__dirname + "/fonts/SutonnyOMJ.ttf");
    const customFont = await pdfDoc.embedFont(fontBytes);
    const customFontBengli = await pdfDoc.embedFont(bengliFontBytes);
    const generateAndPlaceText = (page, type, content, x, y, size, color, spacing, font) => {
      if (type === 'name' && spacing > 0) {
        for (let i = 0; i < content.length; i++) {
          page.drawText(content[i], {
            x: x,
            y: height - y,
            size: size,
            color: rgb(color.r, color.g, color.b),
          });
          if (spacing > 0) {
            x += size + spacing;
          } else {
            x += size - 3
          }
        }
      } else if (type === 'name' && spacing === 0) {
        page.drawText(content, {
          x: x,
          y: height - y,
          size: size,
          color: rgb(color.r, color.g, color.b),
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
    if (req.body.clientName) {
      generateAndPlaceText(firstPage, 'name', req.body.clientName, 51, 307.8, 10.3, { r: 0, g: 0, b: 0 }, 4.5, '');
      generateAndPlaceText(secondPage, 'name', req.body.clientName, 125, 640.8, 12, { r: 0, g: 0, b: 0 }, 0, '');
    }

    if (req.body.jointApplicantName) {
      generateAndPlaceText(secondPage, 'name', req.body.jointApplicantName, 125, 665.8, 12, { r: 0, g: 0, b: 0 }, 0, '');
      generateAndPlaceText(firstPage, 'name', req.body.jointApplicantName, 150, 805.8, 10, { r: 0, g: 0, b: 0 }, 0, '');
    }


    // Date of birth
    if (req.body.clientDateOfBirth) {
      generateAndPlaceText(firstPage, 'name', req.body.clientDateOfBirth, 445, 664.5, 9, { r: 0, g: 0, b: 0 }, 5.1, '');
    }

    // occupation
    if (req.body.clientOccupation) {
      generateAndPlaceText(firstPage, 'name', req.body.clientOccupation, 330, 345, 10, { r: 0, g: 0, b: 0 }, undefined, '');
    }

    // father/husband name
    if (req.body.clientGuardian) {
      generateAndPlaceText(firstPage, 'name', req.body.clientGuardian, 145, 363, 10, { r: 0, g: 0, b: 0 }, undefined, '');
    }

    // mother name
    if (req.body.clientMother) {
      generateAndPlaceText(firstPage, 'name', req.body.clientMother, 110, 382, 10, { r: 0, g: 0, b: 0 }, undefined, '');
    }

    // address
    if (req.body.clientAddress) {
      generateAndPlaceText(firstPage, 'name', req.body.clientAddress, 90, 430, 10, { r: 0, g: 0, b: 0 }, 0, '')
    }

    if (req.body.clientDivision) {
      generateAndPlaceText(firstPage, 'name', req.body.clientDivision, 280, 445, 8, { r: 0, g: 0, b: 0 }, 0, '')
    }

    // city
    if (req.body.clientCity) {
      generateAndPlaceText(firstPage, 'name', req.body.clientCity, 70, 445, 10, { r: 0, g: 0, b: 0 }, 0, '')
    }

    // postal code
    if (req.body.clientPostalCode) {
      generateAndPlaceText(firstPage, 'name', req.body.clientPostalCode, 195, 445, 10, { r: 0, g: 0, b: 0 }, 0, '')
    }

    // country
    if (req.body.clientCountry) {
      generateAndPlaceText(firstPage, 'name', req.body.clientCountry, 375, 445, 10, { r: 0, g: 0, b: 0 }, 0, '')
    }

    // mobile
    if (req.body.clientMobileNumber) {
      generateAndPlaceText(firstPage, 'name', req.body.clientMobileNumber, 96, 465, 8, { r: 0, g: 0, b: 0 }, 0, '')
    }

    // email
    if (req.body.clientEmail) {
      generateAndPlaceText(firstPage, 'name', req.body.clientEmail.slice(7), 285, 465, 10, { r: 0, g: 0, b: 0 }, 0, '')
    }

    // nid
    if (req.body.clientNid) {
      generateAndPlaceText(firstPage, 'name', req.body.clientNid, 155, 720, 10, { r: 0, g: 0, b: 0 }, 0, '')
    }

    // bank name
    if (req.body.clientBankName) {
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
    fs.writeFile(`${rootFolder}\\${folderName}/${folderName}.pdf`, modifiedPdfBytes, err => {
      if (err) {
        console.log(err)
      } else {
        console.log('pdf saved!')
      }
    })
    fs.writeFile(`${rootFolder}\\${folderName}/${folderName}.11`, text, (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log("Text file created with fixed spaces.");
    });
    // res.send(Buffer.from(modifiedPdfBytes));
    res.status(200).json({
      status: 'Success',
      message: 'Folder create successfully.',
      folderPath: rootFolder
    })
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