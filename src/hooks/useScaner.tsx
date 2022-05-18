import Head from 'next/head'
import React from 'react'
import { dataUrlToFile, getRondomString } from '../helpers/index'


export const useScaner = ()=> {
    const [file, setFile] = React.useState<File | null>(null)
    var scanRequest = {
        "use_asprise_dialog": true, // Whether to use Asprise Scanning Dialog
        "show_scanner_ui": false, // Whether scanner UI should be shown
        "twain_cap_setting": { // Optional scanning settings
            "ICAP_PIXELTYPE": "TWPT_RGB" // Color
        },
        "output_settings": [{
            "type": "return-base64",
            "format": "pdf"
        }]
    };

    /** Triggers the scan */
    function scan() {
        scanner.scan(displayImagesOnPage, scanRequest);
    }

    /** Processes the scan result */
    function displayImagesOnPage(successful:any, mesg:string, response:any) {
        if (!successful) { // On error
            console.error('Failed: ' + mesg);
            return;
        }
        if (successful && mesg != null && mesg.toLowerCase().indexOf('user cancel') >= 0) { // User cancelled.
            console.info('User cancelled');
            return;
        }
        var scannedImages = scanner.getScannedImages(response, true, false); // returns an array of ScannedImage
        for (var i = 0;
            (scannedImages instanceof Array) && i < scannedImages.length; i++) {
            var scannedImage = scannedImages[i];

            dataUrlToFile(scannedImage.src, `${getRondomString(10)}.pdf`).then(
                (file) => {
                    setFile(file)
                }
            ).catch(
                (err) => {
                    console.log(err);
                }
            )
        }
    }

    return {scan, file}
}
