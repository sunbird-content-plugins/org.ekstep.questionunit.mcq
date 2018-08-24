var MCQController = MCQController || {};

/**
 * returns complete sequence plugin renderer html, 
 * @param {String} selectedLayout selected layout from editor
 * @param {Object} availableLayout provides list of layouts
 * @memberof org.ekstep.questionunit.mcq.horizontal_and_vertical
 */
MCQController.getQuestionTemplateType1 = function (selectedLayout, availableLayout) {

  MCQController.selectedLayout = selectedLayout;
  var wrapperStart = '<div class="mcq-content-container plugin-content-container" >';
  var wrapperStartQuestionComponent = '<div class="question-content-container">';
  var wrapperEndQuestionComponent = '</div>';
  var wrapperEnd = '</div><script>MCQController.onDomReady()</script>';
  var getLayout;
  if (availableLayout.horizontalLayout == selectedLayout) {
    getLayout = MCQController.getOptionLayout('horizontal');
  } else {
    getLayout = MCQController.getOptionLayout('vertical');
  }
  return wrapperStart + wrapperStartQuestionComponent + org.ekstep.questionunit.questionComponent.generateQuestionComponent(MCQController.pluginInstance._manifest.id) + wrapperEndQuestionComponent + getLayout + wrapperEnd;
}

MCQController.getOptionLayout = function(layout){
  return '<div class="option-container <%= layout %>">\
            <div class="option-block-container">\
                <div class="option-block">\
                    <img src="./public/assets/music-blue.png" class="audio" />\
                    <div class="option-image-container">\
                        <img src="./public/assets/sample-images/laugh.png"  />\
                    </div>\
                    <div class="option-text-container">\
                        <span>HClO3</span>\
                    </div>\
                    <img src="./public/assets/tick_icon.png" class="tick" />\
                </div>\
              </div>\
            </div>\
          </div>'
}

MCQController.onDomReady = function(){

}