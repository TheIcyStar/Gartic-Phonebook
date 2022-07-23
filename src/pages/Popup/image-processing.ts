// Crop image to a square and resize it to the given width, return as a JPEG data URL
export function shrinkImage(image: HTMLImageElement, maxWidth: number): string {
    let canvas = document.createElement("canvas");
    canvas.width = maxWidth;
    canvas.height = maxWidth;
    let ctx = canvas.getContext("2d");
    if(!ctx) return "";

    let imageWidth = image.width;
    let imageHeight = image.height;

    // Determine the x and y offset and width to crop the image to a square
    let xOffset = 0;
    let yOffset = 0;
    let cropWidth = imageWidth;

    if (imageWidth > imageHeight) {
        cropWidth = imageHeight;
        xOffset = (imageWidth - imageHeight) / 2;
    } else { 
        yOffset = (imageHeight - imageWidth) / 2;
    }

    // Draw resized image to canvas
    ctx.drawImage(image, xOffset, yOffset, cropWidth, cropWidth, 0, 0, maxWidth, maxWidth);

    return canvas.toDataURL("image/jpeg");
}