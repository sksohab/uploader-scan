![OIP](https://github.com/sksohab/uploader-scan/assets/113328574/c220f28a-75ec-4bed-bbfe-5ce2c21dab09) ![clamav_logo](https://github.com/sksohab/uploader-scan/assets/113328574/ed143c72-6dbd-4d20-ae40-0513b0b0caaf) ![download](https://github.com/sksohab/uploader-scan/assets/113328574/a708d817-b2c6-454e-8a9d-4e811945e1bd)

## Description

This project has been developed using NestJS and ClamAV. ClamAV is an open source antivirus engine for detecting trojans, viruses, malware & other malicious threats. It scans uploaded file stream and return responses whether the file is infected or not with appropriate virus details. The default max file size limit is 10MB.

## Demo

https://github.com/sksohab/uploader-scan/assets/113328574/74c1163c-87d0-4eb4-a7f3-144178e49b3d

## Installation

```bash
$ docker compose build
```

## Running the app

```bash
$ docker compose up
```

## After running the app

The application will be up and running `http://uploadFileScanner-blockchain.ey.docker:3311`. There will be 2 endpoints mainly `/scanFile` and `/scanFiles`.

```
/scanFile - This can be used for single file scan. In request body, pass the file to be scanned with a key `file`
Responses:
{
    "isInfected": false,
    "message": "File: {filename} is OK"
}

/scanFiles - This can be used for multiple file scan. In request body, pass all the files to be scanned with a key `files`
Responses:
[
    {
        "isInfected": false,
        "message": "File: {filename} is OK"
    },
    {
        "isInfected": false,
        "message": "File: {filename} is OK"
    }
]
```
