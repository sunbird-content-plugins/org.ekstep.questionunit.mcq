var MCQController = MCQController || {};
MCQController.getHorizontalTemplate = function () {
  return "<div class='qc-horizontal-option-container'> \
  <table class='qc-horizontal-option-table'> \
  <tr class='qc-horizontal-option-outer'> \
  <% _.each(question.data.options, function(val,key,index) { %> \
   <td class='qc-horizontal-option-td mcq-option-value' onclick=MCQController.pluginInstance.logTelemetryInteract(event);MCQController.checkOptioninHorizontal('<%= key %>');MCQController.pluginInstance.selectedvalue(event,'<%= key %>')> \
   <div class='qc-horizontal-option-value'> \
   <div class='mcq-selected-option'></div> \
   <div id=<%=key%> class='qc-option-horizontal-text'> \
    <% if(val.audio.length > 0 && val.image.length == 0){%> \
      <div> \
       <img class='qc-horizontal-audio-with-image' onclick=MCQController.pluginInstance.playAudio('<%= val.audio %>')  src=<%=MCQController.pluginInstance.getDefaultAsset(MCQController.pluginInstance._defaultAudioIcon) %>>\
      </div> \
      <%}%> \
    <% if(val.image.length>0){%> \
      <div class='qc-opt'> \
       <img class='qc-horizontal-option-image' onclick='MCQController.showImageModel(event)' src=<%=MCQController.pluginInstance.getAssetUrl( val.image) %>>\
      </div> \
      <%}%> \
      <% if(val.image.length == 0 && val.audio.length == 0) {%> \
         <div class='qc-option-txt' class='qc-opt'> \
         <%=val.text%> \
          </div>\
      <%}%> \
   </div> \
    <div class='qc-option-horizontal-checkbox'> \
     <div> \
      <input type='radio' name='radio' value='pass' class='qc-option-input-checkbox' onclick=MCQController.pluginInstance.logTelemetryInteract(event);MCQController.pluginInstance.selectedvalue(event,'<%= key %>') id='option'> \
     </div> \
     <% if(val.audio.length > 0 && val.image.length > 0){%> \
      <div> \
       <img class='qc-horizontal-audio' onclick=MCQController.pluginInstance.playAudio('<%= val.audio %>')  src=<%=MCQController.pluginInstance.getDefaultAsset(MCQController.pluginInstance._defaultAudioIcon) %>>\
     </div>\
     <%}%> \
   </div> \
   </div> \
   </td> \
    <% }); %> \
  </tr> \
   </div> \
  </table> \
  </div>";
};
MCQController.checkOptioninHorizontal = function (index) {
  $(".mcq-selected-option").removeClass("mcq-option-checked");
  $('.mcq-selected-option').eq(index).addClass('mcq-option-checked');
};