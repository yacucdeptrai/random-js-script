var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js';
document.head.appendChild(script);

script.onload = function () {
    function extractPNGUrls(htmlCode) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlCode, 'text/html');
        
        const mdCMN09ImageElements = doc.querySelectorAll('.mdCMN09Image');

        const filteredElements = Array.from(mdCMN09ImageElements).filter(element => !element.classList.contains('FnPreview'));

        const pngUrls = filteredElements.flatMap(element => {
            const backgroundImage = element.style.backgroundImage;
            const match = backgroundImage.match(/url\(["']?([^"']*)["']?\)/);
            return match ? [match[1]] : [];
        });

        return pngUrls;
    }

    const htmlCode = document.body.innerHTML;

    const pngUrls = extractPNGUrls(htmlCode);

    const zip = new JSZip();

    Promise.all(pngUrls.map((url, index) => fetch(url).then(response => response.blob())))
        .then(blobs => {
            blobs.forEach((blob, index) => {
                zip.file(`image_${index + 1}.png`, blob);
            });

            return zip.generateAsync({ type: 'blob' });
        })
        .then(blob => {
            const link = document.createElement('a');

            link.download = 'images.zip';
            link.href = URL.createObjectURL(blob);

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
};
