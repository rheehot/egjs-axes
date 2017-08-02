(function() {
  const SUPPORT_TOUCH = "ontouchstart" in window;
  const IMAGE_SIZE = 4312;
  const wrapper = document.getElementById("zoomWrapper");
  const wrapperSize = wrapper.getBoundingClientRect().width;
  wrapper.style.height = wrapperSize + "px";
  const imageView = document.getElementById("subway");
  const baseScale = wrapperSize / IMAGE_SIZE;
  const axes = new eg.Axes({
		axis: {
			x: {
        range: [0, 0],
        bounce: 100
			},
			y: {
				range: [0, 0],
				bounce: 100
      },
      zoom: {
        range: [baseScale, 1]
      }
    },
    deceleration: 0.003
  }, {
    zoom: baseScale
  })
  .on("change", ({pos, delta, inputEvent, set}) => {
    if(inputEvent && delta.zoom) {
      const center = SUPPORT_TOUCH ? inputEvent.center : {
        x: inputEvent.layerX,
        y: inputEvent.layerY
      };
      // https://stackoverflow.com/questions/2916081/zoom-in-on-a-point-using-scale-and-translate
      const beforeZoom = pos.zoom - delta.zoom;
      const newX = pos.x - (center.x/pos.zoom - center.x/beforeZoom);
      const newY = pos.y - (center.y/pos.zoom - center.y/beforeZoom);
      set({x: newX, y: newY});
      imageView.style[eg.Axes.TRANSFORM] = `scale(${pos.zoom}) translate(${-newX}px, ${-newY}px) `;

      // change view
      axes.options.axis.y.range[1] = axes.options.axis.x.range[1] = axes.options.axis.x.range[1] - (wrapperSize/pos.zoom - wrapperSize/beforeZoom);
    } else {
      imageView.style[eg.Axes.TRANSFORM] = `scale(${pos.zoom}) translate(${-pos.x}px, ${-pos.y}px) `;
    }
  });
  axes.connect("zoom", SUPPORT_TOUCH ? 
    new eg.Axes.PinchInput(wrapper) :
    new eg.Axes.WheelInput(wrapper, {
      scale: Math.abs(baseScale)
    })
  ).connect("x y", new eg.Axes.PanInput(wrapper, {
    scale: [-1, -1]
  }));
})();