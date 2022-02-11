/**
 * Constants
 */
 const ROOM_LIST_ID_SELECTOR = 'RoomList';
 const ATTRIBUTE_DATA_RID_SELECTOR = 'data-rid';
 const BUTTON_SWITCH_ROOM_SELECTOR = 'sidebarSwitch button';
 const ROOM_LIST_CONTAINER_SELECTOR = '_roomListContainer div[tabindex="0"]';
 
 const BLACK_ID_LIST_FILE_URL = 'http://192.168.104.38/V5.14/Test/Web.PaymentTest/blackListIds.txt';

 /**
  * Main
  */
 var intervalId = -1;
 var blackIdList = [];
 $(function () {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', BLACK_ID_LIST_FILE_URL, true);
    xhr.responseType = 'text';
    xhr.onload = function(e) {
        if (this.response.trim() !== '') {
            blackIdList = this.response.trim().split("\n");
        }

        // Execute get room list element
        var roomList = document.getElementById(ROOM_LIST_ID_SELECTOR);
        if (roomList !== null) {
            console.log("Not Setting Interval");
            removingNotInvolve(blackIdList);
        } else {
            intervalId = setInterval(removingNotInvolve, 1000, blackIdList);
            console.log("Setting Interval : " + intervalId);
        }
    };
    
    xhr.send();
 });
 
 /**
  * Removing Not Involve
  *
  * @param {*} blackIdList Black Id List
  */
 function removingNotInvolve(blackIdList) {
     try {
         var roomList = document.getElementById(ROOM_LIST_ID_SELECTOR);
         if (roomList == null) return;
 
         var classNameOfRoom = roomList.firstChild.firstChild.classList[0];
         var listItems = document.getElementsByClassName(classNameOfRoom);
 
         // Filter room by id setting
         $.each(listItems, function (index) {
             if (listItems[index].hasAttribute(ATTRIBUTE_DATA_RID_SELECTOR)) {
                 var value = listItems[index].getAttribute(ATTRIBUTE_DATA_RID_SELECTOR);
                 var findValue = undefined;
 
                 if (blackIdList.length !== 0) {
                     findValue = blackIdList.find(function (id) {
                         return id.trim() == value.trim();
                     });
                 }
                 var hasFindValue =
                   findValue !== undefined && findValue !== '' && findValue !== null;
                 if (value.search("Direct") !== -1 || hasFindValue) {
                     listItems[index].style.display = 'none';
                 }
             }
         });
 
         var classNameOfShowMore = roomList.firstChild.lastChild.classList[0];
         document.getElementsByClassName(classNameOfShowMore)[0].style.display = 'none';
 
         $("#" + BUTTON_SWITCH_ROOM_SELECTOR).click(function () {
             setTimeout(removingNotInvolve, 2000, blackIdList);
         });
 
         $('#' + ROOM_LIST_CONTAINER_SELECTOR).click(function () {
             setTimeout(removingNotInvolve, 2000, blackIdList);
         });
 
         if (intervalId != -1) {
             console.log("Removing Interval: " + intervalId);
             clearInterval(intervalId);

             // Set interval time to reload setting (5 minute ~ 50 second ~ 50 000 milliseconds)
             intervalId = setInterval(removingNotInvolve, 50000, blackIdList);
             console.log("Re-setting Interval : " + intervalId);
             intervalId = -1;
         }
     } catch (error) {
         console.log(error);
     }
 }