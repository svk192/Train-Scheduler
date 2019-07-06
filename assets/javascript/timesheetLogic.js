


  // web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCaTCX-uyydXjG-USeMq4D918vhReRJGyg",
    authDomain: "classtesting-2d52e.firebaseapp.com",
    databaseURL: "https://classtesting-2d52e.firebaseio.com",
    projectId: "classtesting-2d52e",
    storageBucket: "",
    messagingSenderId: "329512794790",
    appId: "1:329512794790:web:e3dd0388c7af6ffa"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);



  // Create a variable to reference the database
  var database = firebase.database();

  // Initial Values
  var name = "";
  var destination = "";
  var start =moment();
  var frequency = 0;
  var startValue;

  // Capture Button Click
  $("#add-train-btn").on("click", function(event) {
    // Don't refresh the page!
    event.preventDefault();

    name = $("#train-name-input").val().trim();
    destination = $("#destination-input").val().trim();
    startValue =  $("#start-input").val().trim();
    frequency = $("#frequency-input").val().trim();

    start.set('hour', parseInt(startValue.substring(0,2)));
    start.set('minute', parseInt(startValue.substring(3,5)));
  
    database.ref().push({
      name: name,
      destination: destination,
      start: start.format("HH:mm"),
      frequency: frequency
    });

  });
  var nextArrival =0;
  var minutesAway = 0;
  var offset = 0;
  var currentTime;
  var timeDelta = 0;
  var startTime = moment();

//   var d2 = moment(datetime.currentTime);

//   // Firebase watcher + initial loader 
  database.ref().on("child_added", function(snapshot)  {
    var sv = snapshot.val();
    currentTime = moment().format("HH:mm");
    console.log(currentTime);
    
    startTime.set('hour', parseInt(sv.start.substring(0,2)));
    
    startTime.set('minute', parseInt(sv.start.substring(3,5)));

    timeDelta = moment().diff(moment(startTime),"minutes");
    
    offset = timeDelta % sv.frequency;
    
    minutesAway = sv.frequency - offset;

    nextArrival = moment().add(minutesAway, "minutes").format("HH:mm");

    $("#train-table").append("<tr><td>"+ sv.name +"</td><td>"+sv.destination+"</td><td>" 
    + sv.frequency
    + "</td><td>"
    + nextArrival+"</td><td>"
    + minutesAway
    +"</td></tr>");
   
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });
