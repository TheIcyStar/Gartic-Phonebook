// Fit image to a square and resize it to the given width, return as a JPEG data URL
export function shrinkImage(image: HTMLImageElement, maxWidth: number): string {
    let canvas = document.createElement("canvas");
    canvas.width = maxWidth;
    canvas.height = maxWidth;
    let ctx = canvas.getContext("2d");
    if(!ctx) return "";

    let imageWidth = image.width;
    let imageHeight = image.height;

    // Determine the x and y offset and width to fit the image to a square
    let xOffset = 0;
    let yOffset = 0;
    let cropWidth = imageWidth;

    if (imageWidth > imageHeight) {
        cropWidth = imageWidth;
        yOffset = ((imageWidth - imageHeight) / 4) * (maxWidth / imageHeight);
    }
    else {
        cropWidth = imageHeight;
        xOffset = ((imageHeight - imageWidth) / 4) * (maxWidth / imageWidth);
    }

    // Draw resized image to canvas
    ctx.drawImage(image, 0, 0, cropWidth, cropWidth, xOffset, yOffset, maxWidth, maxWidth);

    return canvas.toDataURL("image/png");
}