var MCQController = MCQController || {};
MCQController.getMcq2Template = function (question) {
  var questionTemplate = MCQController.getQuestionTemplate();
  var optionsTemplate = '';
  if (question.config.layout == "Vertical2")
    optionsTemplate = MCQController.getOptionsTemplate2_1(question.data.options);
  else if (question.config.layout == "Grid2")
    optionsTemplate = MCQController.getOptionsTemplate2_2(question.data.options)
  return org.ekstep.questionunit.backgroundComponent.getBackgroundGraphics() + "<div class='mcq-qLeft-content-container'>"
    + questionTemplate + optionsTemplate +
    "</div>\
";
};

MCQController.getQuestionTemplate = function () {
  return "<div class='mcq-qLeft-question-container'>\
                <div class='mcq-question-image'>\
                <img class='q-image' onclick='MCQController.showImageModel(event)'\ src=<%=MCQController.pluginInstance.getAssetUrl( question.data.question.image) %> />\
                </div>\
                <div class='mcq-question-text'>\
                  <div class='mcq-text-content'>\
                  <span style='display:table-cell; vertical-align:middle;'><%= question.data.question.text %></span>\
                  </div>\
                </div>\
                <% if ( question.data.question.audio.length > 0 ){ %> \
                <img class='audio-image' src=<%=MCQController.pluginInstance.getDefaultAsset(MCQController.pluginInstance._defaultAudioIcon)%>\ onclick=MCQController.pluginInstance.playAudio('<%= question.data.question.audio %>') />\
                <% } %> \
              </div>\
              ";
}

MCQController.getOptionsTemplate2_1 = function (options) {
  var opts = ''
  _.each(options, function (val, key, index) {
    opts += MCQController.getOptionForMCQ2(val, key);
  });
  return "<div class='mcq-2-options-container'>"
    + opts +
    "</div>\
";
}


MCQController.getOptionForMCQ2 = function (option, key) {
  var optTemplate = "<div class='text-option option-background text-option-<%=key+1%>' onClick=MCQController.onMCQ2OptionSelected(event,<%= key %>)>\
  <div class='audio-option-image-container'>\
  <% if ( option.audio.length > 0 ){ %> \
  <img class='audio-option-image'    src=<%=MCQController.pluginInstance.getDefaultAsset(MCQController.pluginInstance._defaultAudioIcon)%> onclick=MCQController.pluginInstance.playAudio('<%= option.audio %>') />\
  <% } %> \
  </div>\
  <div class='text-content'>\
  <%= option.text %>\
  </div>\
  <div class='tick-icon-holder'>\
  <img src=<%= MCQController.pluginInstance.getDefaultAsset('tick_icon.png') %> style='height: 100%;'>\
  </div>\
  </div>\
"
  return _.template(optTemplate)({ "option": option, "key": key });
}
MCQController.getOptionsTemplate2_2 = function (options) {
  var optionTemplate = ''
  _.each(options, function (val, key, index) {
    optionTemplate += MCQController.getOptionForMcq2_2(val, key);
  });
  return optionTemplate;
}

MCQController.getOptionForMcq2_2 = function (option, key) {
  var optTemplate = " <div class='mcq2-2-option mcq2-2-option<%=key+1%>' onClick=MCQController.onMCQ2_2OptionSelected(event,<%= key %>)>\
  <%if(option.image){%>\
      <img class='mcq2-2-option-image'\
      src=<%=MCQController.pluginInstance.getAssetUrl(option.image) %> />\
  <%}%>\
  <%if(!option.image && option.text){%>\
    <div><%= option.text %></div>\
  <%}%>\
  <div class='mcq2-2-check-image-holder' >\
    <img class='mcq2-2-check-image'\
    src=<%= MCQController.pluginInstance.getDefaultAsset('tick_icon.png') %> />\
  </div>\
</div>\
";
  return _.template(optTemplate)({ "option": option, "key": key });
}

MCQController.deselectAll = function () {
  $(".mcq2-2-check-image").hide();
  $(".tick-icon-holder").hide();
}

MCQController.registerClick = function () {
  $(".mcq2-2-option").click(function () {
    $(".mcq2-2-check-image").hide();
    $(this).find(".mcq2-2-check-image").show();
  })
  $(".text-option").click(function () {
    $(".text-option").removeClass("selected-option-bg");
    $(".text-option").addClass("option-background");
    $(".tick-icon-holder").hide();
    $(this).removeClass("option-background");
    $(this).addClass("selected-option-bg");
    $(this).find(".tick-icon-holder").show();
  })
}

MCQController.onMCQ2_2OptionSelected = function (event, index) {
  $('.mcq2-2-option').removeClass('opt-selected');
  var optElt = $(event.target).closest('.mcq2-2-option');
  if (optElt) optElt.addClass('opt-selected');
  MCQController.pluginInstance.onOptionSelected(event, index);
  if (MCQController.pluginInstance._question.data.options[index].audio)
    MCQController.pluginInstance.playAudio(MCQController.pluginInstance._question.data.options[index].audio);
}

MCQController.onMCQ2OptionSelected = function (event, index) {
  $('.text-option').removeClass('opt-selected');
  var optElt = $(event.target).closest('.text-option');
  if (optElt) optElt.addClass('opt-selected');
  MCQController.pluginInstance.onOptionSelected(event, index);
}

MCQController.getMCQ2LayoutChanges = function () {
  if (MCQController.pluginInstance._question.data.options.length < 4) {
    MCQController.adjustOptions(MCQController.pluginInstance._question);
  }
}

MCQController.adjustOptions = function (question) {
  var optLength = question.data.options.length;
  if (question.config.layout == "Vertical2") {
    if (optLength == 2) {
      $(".text-option-1").css("margin-top", "25.71%");
    }
    else if (optLength == 3) {
      $(".text-option-1").css("margin-top", "12.85%");
    }
  }
  else if (question.config.layout == "Grid2") {
    if (optLength == 2) {
      $(".mcq2-2-option").css("margin-top", "15%");
    }
    else if (optLength == 3) {
      $(".mcq2-2-option3").css("margin-left", "17.15%");
    }
  }
}
