var MCQController = MCQController || {};

/**
 * returns complete sequence plugin renderer html, 
 * @param {String} selectedLayout selected layout from editor
 * @param {Object} availableLayout provides list of layouts
 * @memberof org.ekstep.questionunit.mcq.horizontal_and_vertical
 */
MCQController.getQuestionTemplateType1 = function (selectedLayout) {

  //MCQController.selectedLayout = selectedLayout;
  var wrapperStart = org.ekstep.questionunit.backgroundComponent.getBackgroundGraphics() + '<div class="mcq-content-container plugin-content-container" >';
  var wrapperStartQuestionComponent = '<div class="question-content-container">';
  var wrapperEndQuestionComponent = '</div>';
  var wrapperEnd = '</div>';
  var getLayout;
  if (selectedLayout == MCQController.pluginInstance._constant.horizontalLayout) {
    getLayout = MCQController.getOptionLayout('horizontal');
  } else {
    getLayout = MCQController.getOptionLayout('vertical');
  }
  return wrapperStart + wrapperStartQuestionComponent + org.ekstep.questionunit.questionComponent.generateQuestionComponent(MCQController.pluginInstance._manifest.id) + wrapperEndQuestionComponent + getLayout + wrapperEnd;
}

MCQController.getOptionLayout = function(layout){
  return '<div class="option-container ' +  layout + '">\
            <div class="option-block-container">\
            <% _.each(question.data.options,function(val,key){ %>\
                <div class="option-block <% if(val.isCorrect) { %> mcq-correct-answer<% } %>" onclick="MCQController.selectOptionType1(this)">\
                    <div class="option-image-container <% if(!val.image) { %> no-image<% } %>" \>\
                  <%  if(val.image) { %>\
                        <img onclick="MCQController.showImageModel(event, \'<%= val.image %>\')" src="<%= val.image %>" />\
                  <% } %>\
                    </div>\
                    <%  if(val.audio) { %>\
                      <img onclick="MCQController.pluginInstance.playAudio({src:\'<%= val.audio %>\'})" src="<%= MCQController.pluginInstance.getDefaultAsset("music-blue.png") %>" class="audio" />\
                    <% } %>\
                    <div class="option-text-container<% if(val.audio) { %> with-audio <% } %> <% if(val.image) { %>with-image<% } %>">\
                  <%  if(val.text) { %>\
                        <span><%= val.text %></span>\
                  <% } %>\
                    </div>\
                    <img src="<%= MCQController.pluginInstance.getDefaultAsset("tick_icon.png") %>" class="tick" />\
                </div>\
              <% }) %>\
              </div>\
            </div>\
          </div>'
}

MCQController.selectOptionType1 = function(element){
  $('.option-block').removeClass('selected');
  $(element).addClass('selected');
}