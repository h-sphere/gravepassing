export const renderNoise = (canvas, ctx) => {

/**
 * The general idea with perlin noise is to generate
 * noise at several resolutions and overlay them
 * with varying amplitudes and opacities.
 *
 * Rather than do all that in memory, I'm going to
 * exploit the way <canvas> elements currently render
 * stretched images - letting the GPU handle
 * smoothing and blending
 */


let randcache: number[][] = [];
function noise(x, y) {
    if(typeof(randcache[x])=="undefined")
        randcache[x] = [];
    if(typeof(randcache[x][y])=="undefined")
       randcache[x][y] = Math.random();
    return randcache[x][y];
}

/**
 * Generates a 2D noise Image of dimensions
 * width x height with the given period.
 * n = 1 equates to highest frequency
 * n = 32 equates to low frequency
 */
function noise_2d(width, height, n) {
    width = width/n;
    height = height/n;
    
    var imagedata = ctx.createImageData(width, height);
    
    for(var x=0; x<imagedata.width; x++) {
        for(var y=0; y<imagedata.height; y++) {
            var val = noise(x, y);
            val *= 255;
            putpix(imagedata, x, y, val, val, val, 255);
        }
    }
    
    let tmp_canvas = document.createElement("canvas");
    let tmp_ctx = tmp_canvas.getContext("2d")!;
    
    tmp_canvas.width = width;
    tmp_canvas.height = height;
    
    tmp_ctx.putImageData(imagedata, 0, 0);
    
    var img = new Image();
    img.src = tmp_canvas.toDataURL();
    
    // delete tmp_canvas;
    // delete tmp_ctx;
    
    return img;        
}


/**
 * Generates perlin noise with the given
 * number of octaves
 */
function perlin_noise(octaves, width, height, threshold) {
    var images = {},
        loaded_count = 0,
        arr: number[] = [];
    
    for(var i=0; i<octaves; i++) {
        var n = Math.pow(2, i),
            alpha = 1 / Math.pow(2, octaves-1-i);
        
        arr.push(1 / Math.pow(2, i));
        
        var img = noise_2d(width, height, n);
        img.onload = function() {
            loaded_count++;
            if(loaded_count == octaves) {
                for(var j in arr) {
                    var alpha = arr[j];
                    ctx.globalAlpha = alpha;
                    ctx.drawImage(images[alpha], 0, 0, width, height);
                }
                
                if(threshold) postprocess(width, height, threshold);
            }
        }
        images[alpha] = img;
        
    }
 }

function postprocess(width, height, func) {
    var imdata = ctx.getImageData(0, 0, width, height);
    
    for(var x=0; x<width; x++) {
        for(var y=0; y<height; y++) {
            var offset = (x + y*width)*4;
            
            imdata.data[offset + 0] = 255*func(x, y, imdata.data[offset + 0]/255);
            imdata.data[offset + 1] = 255*func(x, y, imdata.data[offset + 1]/255);
            imdata.data[offset + 2] = 255*func(x, y, imdata.data[offset + 2]/255);
            imdata.data[offset + 3] = 255*func(x, y, imdata.data[offset + 3]/255);
        }
    }
    
    clear();
    ctx.putImageData(imdata, 0, 0);
}


perlin_noise(4, 800, 600, function(x, y, d) {
    return d;
});


/**
 * Utility method. Blits an rgba pixel to an
 * ImageData object
 */
function putpix(imagedata, x, y, r, g, b, a) {
    var offset = (x + y*imagedata.width)*4;
    imagedata.data[offset + 0] = r;
    imagedata.data[offset + 1] = g;
    imagedata.data[offset + 2] = b;
    imagedata.data[offset + 3] = a;
}

/**
 * Utility method to clear the canvas
 */
function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
}