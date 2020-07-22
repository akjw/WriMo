//from users/dashboard
$("#toggleEditMode").click(() => {
    $("#toggleEditMode").toggleClass('active');
    $("#toggleEditMode").toggleClass('make-gray');
       if($('.edit-btns').css('display') == 'none'){
         $('.edit-btns').show();
       }
       else {
         $('.edit-btns').hide();
       }
   })

$("#bioAdd").click(() => {
  if($('#bioDiv').css('display') == 'none'){
    $('#bioDiv').show();
    $('#bioAdd').html('Close');
  }
  else {
    $('#bioDiv').hide();
    $('#bioAdd').html('Add Bio');
  }
})



$("#bioEdit").click(() => {
  if($('#bioEditDiv').css('display') == 'none'){
    $('#bioEditDiv').show();
    $('#bioEdit').html('Close');
  }
  else {
    $('#bioEditDiv').hide();
    $('#bioEdit').html('Edit Bio');
  }
})
//from works/show
$("#toggleNewComment").click(() => {
    if($('#commentDiv').css('display') == 'none'){
      $('#commentDiv').show();
      $('#toggleNewComment').html('Close Form');
    }
    else {
      $('#commentDiv').hide();
      $('#toggleNewComment').html('Comment');
    }
})

$(".editThis").click((e) => {
  if($('#commentDiv').css('display') != 'none'){
      $('#commentDiv').hide();
      $('#toggleNewComment').html('Comment');
    }
    let username = e.target.dataset['username'];
    console.log(username)
    let commentbody = e.target.dataset['commentbody'];
    console.log(commentbody)
    let commentid = e.target.dataset['commentid'];
    let workid = e.target.dataset['workid'];
    $('#appendFormHere').append('<form id="editComment">')
    $('#editComment').attr({action: `/comment/on/${workid}/edit/${commentid}`, method: 'POST', class: 'mx-2 mb-2 form-horizontal'});
    $('#appendFormHere form').html(`<div><label class="control-label">Commenting as <strong>${username}</strong></label></div>
    <div><textarea class='form-control', name= 'body', id= 'editBody', cols= '30', rows= '5'>${commentbody}</textarea></div>
    <button class="mt-2 btn btn-secondary form-control" type="submit" id="editBtn" style="background-color: #45A29E !important;">Save Changes</button>`);
    $('#appendFormHere').append('</form>')
    $('#editDiv').show();
})

$("#toggleComments").click(() => {
    if($('#allComments').css('display') == 'none'){
      $('#allComments').show();
      $('#toggleComments').html('Hide Comments');
    }
    else {
      $('#allComments').hide();
      $('#toggleComments').html('Show Comments');
    }
})