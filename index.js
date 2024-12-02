const express = require("express");
const { exec } = require('child_process');

const JSZip = require("jszip");
const dotenv = require("dotenv");
const axios = require("axios");
const officegen = require("officegen");
const {
  AlignmentType,
  Document,
  Footer,
  Header,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
  UnderlineType,
  Table,
  TableCell,
  TableRow,
  addLineBreak,
} = require("docx");
dotenv.config();
const cors = require("cors");
const { PDFDocument, rgb, setCharacterSpacing } = require("pdf-lib"); // Import pdf-lib
const fontKit = require("@pdf-lib/fontkit");
const fs = require("fs");
const path = require("path");
const { uploadSingle, resizeUploadedImage } = require("./utils/fileUpload");
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://157.142.6.2:8082",
      "http://192.168.0.1:8082",
      "http://localhost:3000",
      "http://157.142.6.2:8080",
      "http://localhost:8080",
    ],
  })
);
app.use(express.static(path.join(__dirname, 'public'))); //  "public" off of current is root
app.use((req, res, next) => {
  if (req.method == "POST") {
    res.set("Cache-Control", "no-store");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
  }
  next();
});

app.post("/modify-pdf", uploadSingle, resizeUploadedImage, async (req, res) => {
  const zip = new JSZip();
  const result = JSON.parse(req.body.fields);
  // return;
  const folderName = req.body.clientId;
  const rootFolder = process.env.FOLDER_NAME;

  if (!fs.existsSync(`${rootFolder}\\${folderName}`)) {
    fs.mkdirSync(path.join(`${rootFolder}`, folderName), (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Folder is written");
      }
    });
  } else {
    return res.status(400).json({
      status: "Fail",
      message: "Already exist a folder with same name",
    });
  }
  try {
    const signImageBuffer = fs.readFileSync(`${__dirname}/public/sign.jpg`);
    zip.file(`${req.body.clientId}0101.jpg`, signImageBuffer);

    zip
      .generateNodeStream({ type: "nodebuffer", streamFiles: true })
      .pipe(
        fs.createWriteStream(
          `${rootFolder}\\${folderName}/${req.body.clientId}0101.zip`
        )
      )
      .on("finish", function () {
        console.log("sample.zip written.");
      });
  } catch (err) {
    console.error(err);
  }

  function placeWordAtFixedColumn(line, word, column) {
    // Ensure the line has enough spaces to reach the desired column
    if (line.length < column - 1) {
      line += " ".repeat(column - 1 - line.length);
    }

    // Place the word at the exact column position
    line =
      line.slice(0, column - 1) + word + line.slice(column - 1 + word.length);

    return line;
  }

  // Start with an empty line
  let line01 = "";

  // Add words at specified absolute column positions
  line01 = placeWordAtFixedColumn(line01, "0000007Admin 018900", 1);

  let line02 = "";

  // Add words at specified absolute column positions
  line02 = placeWordAtFixedColumn(line02, "01000001", 1);

  let line03 = "";

  // Add words at specified absolute column positions
  line03 = placeWordAtFixedColumn(line03, `02YY${folderName}`, 1);
  line03 = placeWordAtFixedColumn(
    line03,
    `${req.body.clientBankAccountNumber}`,
    141
  );
  line03 = placeWordAtFixedColumn(
    line03,
    `Y${req.body.clientBankRoutingNumber}`,
    157
  );
  line03 = placeWordAtFixedColumn(line03, "", 290);

  let line04 = "";

  line04 = placeWordAtFixedColumn(
    line04,
    `030101BAN${req.body.clientDateOfBirth}`,
    1
  );
  line04 = placeWordAtFixedColumn(
    line04,
    `${req.body.clientGender === "Male" ? "M" : "F"}`,
    58
  );
  line04 = placeWordAtFixedColumn(line04, "", 84);

  let line05 = "";

  line05 = placeWordAtFixedColumn(
    line05,
    `04${req.body.clientName.split(" ")[0]}`,
    1
  );
  line05 = placeWordAtFixedColumn(
    line05,
    `${req.body.clientName.split(" ")[1]}`,
    133
  );
  line05 = placeWordAtFixedColumn(line05, `${req.body.clientName}`, 163);
  line05 = placeWordAtFixedColumn(line05, `${req.body.clientAddress}`, 283);
  // line05 = placeWordAtFixedColumn(line05, `GULSHAN.DHAKA-1212`, 313);
  line05 = placeWordAtFixedColumn(line05, `${req.body.clientCity}`, 373);
  line05 = placeWordAtFixedColumn(line05, `${req.body.clientDivision}`, 398);
  line05 = placeWordAtFixedColumn(line05, `${req.body.clientCountry}`, 423);
  line05 = placeWordAtFixedColumn(line05, `${req.body.clientPostalCode}`, 448);
  line05 = placeWordAtFixedColumn(
    line05,
    `${req.body.clientMobileNumber}`,
    458
  );
  line05 = placeWordAtFixedColumn(
    line05,
    `${req.body.clientEmail.slice(7)}`,
    518
  );
  line05 = placeWordAtFixedColumn(line05, `${req.body.clientGuardian}`, 598);
  line05 = placeWordAtFixedColumn(line05, `${req.body.clientMother}`, 628);
  line05 = placeWordAtFixedColumn(line05, `Y${req.body.clientOccupation}`, 729);
  line05 = placeWordAtFixedColumn(line05, `${req.body.clientNid}`, 760);
  line05 = placeWordAtFixedColumn(line05, "", 780);

  let line06 = "";
  line06 = placeWordAtFixedColumn(line06, "05", 1);
  line06 = placeWordAtFixedColumn(line06, "", 243);
  let line07 = "";
  line07 = placeWordAtFixedColumn(line07, "06", 1);
  line07 = placeWordAtFixedColumn(line07, "", 243);
  // line06 = placeWordAtFixedColumn(line07, "")

  let line08 = "";

  line08 = placeWordAtFixedColumn(
    line08,
    `070101${req.body.clientId}0101.jpg`,
    1
  );
  line08 = placeWordAtFixedColumn(line08, "", 57);

  let docx = officegen("docx");

  // Officegen calling this function after finishing to generate the docx document:
  docx.on("finalize", function (written) {
    console.log("Finish to create a Microsoft Word document.");
  });

  // Officegen calling this function to report errors:
  docx.on("error", function (err) {
    console.log(err);
  });

  // Create a new paragraph:
  let pObj = docx.createP();
  pObj.addText(`SUBMITTED INFORMATION: ${folderName}`, {
    bold: true,
    undefined: true,
  });
  pObj = docx.createP();

  Object.keys(result).forEach((item, index) => {
    pObj.addText(Object.keys(result)[index], {
      bold: true,
      underline: true,
    });
    pObj.addLineBreak();
    pObj.addText(Object.values(result)[index]);
    pObj = docx.createP();
  });

  let out = fs.createWriteStream(
    `${rootFolder}\\${folderName}\\${folderName}.docx`
  );

  out.on("error", function (err) {
    console.log(err);
  });

  // Async call to generate the output file:
  docx.generate(out);

  const getFileExtension = (fileName) => {
    const fileExtension = fileName.split(".")[fileName.split(".").length - 1];
    return fileExtension;
  };

  // fs.writeFile(`${rootFolder}\\${folderName}/${folderName}.11`, line01 + "\n" + line02 + "\n" + line03 + "\n" + line04 + "\n" + line05 + "\n" + line06 + "\n", (err) => {
  //   if (err) {
  //     console.error("Error writing file:", err);
  //     return;
  //   }
  //   console.log("Text file created with words at fixed columns.");
  // });

  fs.writeFile(
    `${rootFolder}\\${folderName}\\${folderName}.11`,
    line01 +
      "\r\n" +
      line02 +
      "\r\n" +
      line03 +
      "\r\n" +
      line04 +
      "\r\n" +
      line05 +
      "\r\n" +
      line06 +
      "\r\n" +
      line07 +
      "\r\n" +
      line08,
    (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log("Text file created with words at fixed columns.");
    }
  );
  try {
    const existingPdfBytes = fs.readFileSync(
      __dirname + "/BO_Account_Open_Form.pdf"
    );

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    pdfDoc.registerFontkit(fontKit);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    const secondPage = pages[1];
    const { width: secondPageWidth, height: secondPageHeight } =
      secondPage.getSize();
    const fetchImage = async (url) => {
      try {
        const response = await axios.get(url, { responseType: "arraybuffer" });
        return response.data;
      } catch (err) {
        console.log(err);
      }
    };

    // const img = await fetchImage(req.body.clientCroppedSignature)
    // console.log(img)
    // fs.writeFile(`${rootFolder}\\${folderName}/${folderName}-client-cropped-sign.jpg`, img,err => {
    //   if(err){
    //       console.log('myerror', err)
    //   }
    // })
    if (req.body.clientPhoto) {
      const response = await axios.get(req.body.clientPhoto, {
        responseType: "arraybuffer",
      });
      const imageBytes = response.data;
      // const imageBytes = await fetchImage(req.body.clientPhoto);
      const fileExtension = getFileExtension(req.body.clientPhoto);
      fs.writeFile(
        `${rootFolder}\\${folderName}/${folderName}-photo.${fileExtension}`,
        imageBytes,
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
      let image;
      if (fileExtension != 'pdf') {
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
    }

    if (req.body.clientSignature) {
      const signatureBytes = await fetchImage(req.body.clientSignature);
      // const signImageBuffer = fs.readFileSync(`${__dirname}/public/sign.jpg`);
      const fileExtension = getFileExtension(req.body.clientSignature);

      fs.writeFile(
        `${rootFolder}\\${folderName}/${folderName}-signature.${fileExtension}`,
        signatureBytes,
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
      let img = await fetchImage(`http://localhost:3001/sign.jpg`)
      img = await pdfDoc.embedJpg(img)
      secondPage.drawImage(img, {
        x: 400,
        y: secondPageHeight - 645.5,
        width: 102,
        height: 19,
      });
    }
    if (req.body.clientNidPhoto !== "undefined") {
      const fileExtension = getFileExtension(req.body.clientNidPhoto);
      const clientNidPhotoBytes = await fetchImage(req.body.clientNidPhoto);

      fs.writeFile(
        `${rootFolder}\\${folderName}/${folderName}-client-nid.${fileExtension}`,
        clientNidPhotoBytes,
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }
    console.log("hahahahah", req.body.clientNominyPhoto);
    if (req.body.clientNominyPhoto !== "undefined") {
      const fileExtension = getFileExtension(req.body.clientNominyPhoto);

      const clientNomineePhotoBytes = await fetchImage(
        req.body.clientNominyPhoto
      );
      console.log("Hello ", clientNomineePhotoBytes);
      fs.writeFile(
        `${rootFolder}\\${folderName}/${folderName}-client-nominee.${fileExtension}`,
        clientNomineePhotoBytes,
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }
    // if (req.body.jointApplicantSign) {
    //   const fileExtension = getFileExtension(req.body.jointApplicantSign)

    //   const jointApplicantSignatureBytes = await fetchImage(req.body.jointApplicantSign)
    //   fs.writeFile(`${rootFolder}\\${folderName}/${folderName}-joint-applicant-sign.${fileExtension}`, jointApplicantSignatureBytes, err => {
    //     if (err) {
    //       console.log(err)
    //     }
    //   })
    //   let jointApplicantSignature;
    //   try {
    //     jointApplicantSignature = await pdfDoc.embedPng(jointApplicantSignatureBytes);
    //   } catch (error) {
    //     jointApplicantSignature = await pdfDoc.embedJpg(jointApplicantSignatureBytes);
    //   }
    //   secondPage.drawImage(jointApplicantSignature, {
    //     x: 400,
    //     y: secondPageHeight - 669,
    //     width: 102,
    //     height: 18
    //   })
    // }

    // if (req.body.jointApplicantPhoto) {
    //   const fileExtension = getFileExtension(req.body.jointApplicantPhoto)

    //   const jointApplicantPhotoBytes = await fetchImage(req.body.jointApplicantPhoto)

    //   fs.writeFile(`${rootFolder}\\${folderName}/${folderName}-joint-applicant-photo.${fileExtension}`, jointApplicantPhotoBytes, err => {
    //     if (err) {
    //       console.log(err)
    //     }
    //   })
    //   let jointApplicantPhoto;
    //   try {
    //     jointApplicantPhoto = await pdfDoc.embedPng(jointApplicantPhotoBytes);
    //   } catch (error) {
    //     jointApplicantPhoto = await pdfDoc.embedJpg(jointApplicantPhotoBytes);
    //   }
    //   secondPage.drawImage(jointApplicantPhoto, {
    //     x: 263,
    //     y: secondPageHeight - 460.5,
    //     width: 102,
    //     height: 105
    //   })
    // }

    if (req.body.clientBankDepositeScreenShot) {
      const fileExtension = getFileExtension(
        req.body.clientBankDepositeScreenShot
      );

      const clientBankDepositePhotoBytes = await fetchImage(
        req.body.clientBankDepositeScreenShot
      );

      fs.writeFile(
        `${rootFolder}\\${folderName}/${folderName}-bank-deposite-screenshot.${fileExtension}`,
        clientBankDepositePhotoBytes,
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }

    const fontBytes = fs.readFileSync(
      __dirname + "/fonts/NotoSansSymbols-Regular.ttf"
    );
    const bengliFontBytes = fs.readFileSync(
      __dirname + "/fonts/SutonnyOMJ.ttf"
    );
    const customFont = await pdfDoc.embedFont(fontBytes);
    const customFontBengli = await pdfDoc.embedFont(bengliFontBytes);
    const generateAndPlaceText = (
      page,
      type,
      content,
      x,
      y,
      size,
      color,
      spacing,
      font
    ) => {
      if (type === "name" && spacing > 0) {
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
            x += size - 3;
          }
        }
      } else if (type === "name" && spacing === 0) {
        page.drawText(content, {
          x: x,
          y: height - y,
          size: size,
          color: rgb(color.r, color.g, color.b),
        });
      } else if (type !== "name") {
        page.drawText(content, {
          x: x,
          y: height - y,
          size: size - 8,
          font: customFont,
          color: rgb(color.r, color.g, color.b),
        });
      } else {
        page.drawText(content, {
          x: x,
          y: height - y,
          size: size,
          color: rgb(color.r, color.g, color.b),
        });
      }
    };

    // account holder name
    if (req.body.clientName) {
      generateAndPlaceText(
        firstPage,
        "name",
        req.body.clientName,
        51,
        307.8,
        10.3,
        { r: 0, g: 0, b: 0 },
        4.5,
        ""
      );
      generateAndPlaceText(
        secondPage,
        "name",
        req.body.clientName,
        125,
        640.8,
        12,
        { r: 0, g: 0, b: 0 },
        0,
        ""
      );
    }

    if (req.body.jointApplicantName !== "undefined") {
      generateAndPlaceText(
        secondPage,
        "name",
        req.body.jointApplicantName,
        125,
        665.8,
        12,
        { r: 0, g: 0, b: 0 },
        0,
        ""
      );
      generateAndPlaceText(
        firstPage,
        "name",
        req.body.jointApplicantName,
        150,
        805.8,
        10,
        { r: 0, g: 0, b: 0 },
        0,
        ""
      );
    }

    // Date of birth
    if (req.body.clientDateOfBirth) {
      generateAndPlaceText(
        firstPage,
        "name",
        req.body.clientDateOfBirth,
        445,
        664.5,
        9,
        { r: 0, g: 0, b: 0 },
        5.1,
        ""
      );
    }

    // occupation
    if (req.body.clientOccupation) {
      generateAndPlaceText(
        firstPage,
        "name",
        req.body.clientOccupation,
        330,
        345,
        10,
        { r: 0, g: 0, b: 0 },
        undefined,
        ""
      );
    }

    // father/husband name
    if (req.body.clientGuardian) {
      generateAndPlaceText(
        firstPage,
        "name",
        req.body.clientGuardian,
        145,
        363,
        10,
        { r: 0, g: 0, b: 0 },
        undefined,
        ""
      );
    }

    // mother name
    if (req.body.clientMother) {
      generateAndPlaceText(
        firstPage,
        "name",
        req.body.clientMother,
        110,
        382,
        10,
        { r: 0, g: 0, b: 0 },
        undefined,
        ""
      );
    }

    // address
    if (req.body.clientAddress) {
      generateAndPlaceText(
        firstPage,
        "name",
        req.body.clientAddress,
        90,
        430,
        10,
        { r: 0, g: 0, b: 0 },
        0,
        ""
      );
    }

    if (req.body.clientDivision) {
      generateAndPlaceText(
        firstPage,
        "name",
        req.body.clientDivision,
        280,
        445,
        8,
        { r: 0, g: 0, b: 0 },
        0,
        ""
      );
    }

    // city
    if (req.body.clientCity) {
      generateAndPlaceText(
        firstPage,
        "name",
        req.body.clientCity,
        70,
        445,
        10,
        { r: 0, g: 0, b: 0 },
        0,
        ""
      );
    }

    // postal code
    if (req.body.clientPostalCode) {
      generateAndPlaceText(
        firstPage,
        "name",
        req.body.clientPostalCode,
        195,
        445,
        10,
        { r: 0, g: 0, b: 0 },
        0,
        ""
      );
    }

    // country
    if (req.body.clientCountry) {
      generateAndPlaceText(
        firstPage,
        "name",
        req.body.clientCountry,
        375,
        445,
        10,
        { r: 0, g: 0, b: 0 },
        0,
        ""
      );
    }

    // mobile
    if (req.body.clientMobileNumber) {
      generateAndPlaceText(
        firstPage,
        "name",
        req.body.clientMobileNumber,
        96,
        465,
        8,
        { r: 0, g: 0, b: 0 },
        0,
        ""
      );
    }

    // email
    if (req.body.clientEmail) {
      generateAndPlaceText(
        firstPage,
        "name",
        req.body.clientEmail.slice(7),
        285,
        465,
        10,
        { r: 0, g: 0, b: 0 },
        0,
        ""
      );
    }

    // nid
    if (req.body.clientNid) {
      generateAndPlaceText(
        firstPage,
        "name",
        req.body.clientNid,
        155,
        720,
        10,
        { r: 0, g: 0, b: 0 },
        0,
        ""
      );
    }

    // bank name
    if (req.body.clientBankName) {
      generateAndPlaceText(
        firstPage,
        "name",
        req.body.clientBankName,
        90,
        575,
        10,
        { r: 0, g: 0, b: 0 },
        0,
        ""
      );
    }

    // branch name
    generateAndPlaceText(
      firstPage,
      "name",
      "Progoti Sharani SME",
      310,
      575,
      10,
      { r: 0, g: 0, b: 0 },
      0,
      ""
    );

    // routing number
    generateAndPlaceText(
      firstPage,
      "name",
      "080271512",
      105,
      555,
      10,
      { r: 0, g: 0, b: 0 },
      0,
      ""
    );

    // bank account number
    generateAndPlaceText(
      firstPage,
      "name",
      "8813002586",
      335,
      555,
      10,
      { r: 0, g: 0, b: 0 },
      0,
      ""
    );

    // bo type
    generateAndPlaceText(
      firstPage,
      "tickMark",
      "\u2713",
      127,
      142,
      30,
      { r: 0, g: 0, b: 0 },
      undefined,
      ""
    );
    generateAndPlaceText(
      firstPage,
      "tickMark",
      "\u2713",
      req.body.boType === "single"
        ? 393
        : req.body.boType === "joint"
        ? 530
        : 455,
      142,
      30,
      { r: 0, g: 0, b: 0 },
      undefined,
      ""
    );

    // gender
    generateAndPlaceText(
      firstPage,
      "tickMark",
      "\u2713",
      req.body.clientGender === "Male" ? 166 : 212,
      340,
      30,
      { r: 0, g: 0, b: 0 },
      undefined,
      ""
    );

    // Resident
    const resident = false;
    generateAndPlaceText(
      firstPage,
      "tickMark",
      "\u2713",
      resident ? 125 : 188,
      659,
      30,
      { r: 0, g: 0, b: 0 },
      undefined,
      ""
    );

    // Nationallity
    generateAndPlaceText(
      firstPage,
      "name",
      req.body.clientNationality,
      250,
      659,
      10,
      { r: 0, g: 0, b: 0 },
      0,
      ""
    );

    // Serialize the modified PDF document to bytes
    const modifiedPdfBytes = await pdfDoc.save();

    // Set response headers for inline preview in the browser
    const fileName = "modified-preview.pdf"; // File name for preview
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=${fileName}`, // Display in browser
    });

    // Send the modified PDF for preview
    fs.writeFile(
      `${rootFolder}\\${folderName}/${folderName}.pdf`,
      modifiedPdfBytes,
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("pdf saved!");
        }
      }
    );
    // fs.writeFile(`${rootFolder}\\${folderName}/${folderName}.11`, text, (err) => {
    //   if (err) {
    //     console.error("Error writing file:", err);
    //     return;
    //   }
    //   console.log("Text file created with fixed spaces.");
    // });
    // res.send(Buffer.from(modifiedPdfBytes));
    res.status(200).json({
      status: "Success",
      message: "Folder create successfully.",
      folderPath: rootFolder,
    });
  } catch (error) {
    console.error("Error modifying PDF:", error);
    res.status(500).send("Error modifying PDF");
  }
});



app.get('/open-folder/:folderName', (req, res) => {
  // const folderPath = 'D:/a_rahat/';
  const folderPath = `C:/Users/ASUS/Desktop/BO/${req.params.folderName}`;
  exec(`start "" "${folderPath}"`, (err) => {
      if (err) {
          console.error(err);
          res.status(500).send('Error opening folder');
      } else {
          res.send('Folder opened successfully');
      }
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
