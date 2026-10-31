let map = null;
// Robust 3-Second Splash Screen Timer
function hideSplashScreen() {
  const splash = document.getElementById('appSplashScreen');
  if (splash) {
    splash.style.opacity = '0';
    splash.style.visibility = 'hidden';
    splash.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
      splash.style.display = 'none';
    }, 500);
  }
}

// Check if page is already loaded or wait for load event
if (document.readyState === 'complete') {
  setTimeout(hideSplashScreen, 3000);
} else {
  window.addEventListener('load', () => {
    setTimeout(hideSplashScreen, 3000);
  });
}


function nextScreen(screenNum) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  
  if (screenNum >= 5) {
    document.getElementById('app-flow').classList.remove('hidden');
    switchTab(5);
  } else {
    document.getElementById('app-flow').classList.add('hidden');
    document.getElementById(`screen-${screenNum}`).classList.add('active');
  }
}

function switchTab(tabNum) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(`view-${tabNum}`).classList.add('active');

  const navIcons = document.querySelectorAll('.nav-icon');
  navIcons.forEach(btn => btn.classList.remove('active'));
  
  if (tabNum === 5) navIcons[0]?.classList.add('active');
  if (tabNum === 8) navIcons[1]?.classList.add('active');
  if (tabNum === 10) navIcons[2]?.classList.add('active');
  if (tabNum === 11) navIcons[3]?.classList.add('active');
  if (tabNum === 14) navIcons[4]?.classList.add('active');

  if (tabNum === 6) {
    setTimeout(initMap, 150);
  }
}

function togglePassword() {
  const pwdInput = document.getElementById('loginPass');
  const eyeIcon = document.getElementById('toggleEye');
  if (pwdInput.type === 'password') {
    pwdInput.type = 'text';
    eyeIcon.classList.replace('fa-eye-slash', 'fa-eye');
  } else {
    pwdInput.type = 'password';
    eyeIcon.classList.replace('fa-eye', 'fa-eye-slash');
  }
}

function initMap() {
  if (map !== null) {
    map.remove();
  }

  // Map coordinates: Coimbatore
  map = L.map('map').setView([11.0168, 76.9558], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; OpenStreetMap'
  }).addTo(map);

  L.marker([11.0168, 76.9558]).addTo(map)
    .bindPopup('Balaji N - Live Location')
    .openPopup();
}

function triggerSOS() {
  alert('🚨 SOS Triggered! Emergency alert and real-time location sent to contacts.');
}

function shareLocation() {
  alert('📍 Live location link copied!');
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}// Speech Recognition (Voice Input) Setup
let recognition = null;
let isListening = false;

if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US'; // English voice input (or Tamil: 'ta-IN')

  recognition.onstart = function() {
    isListening = true;
    const micBtn = document.getElementById('micBtn');
    micBtn.classList.add('listening');
    document.getElementById('chatInput').placeholder = "Listening... Speak now";
  };

  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    document.getElementById('chatInput').value = transcript;
    
    // Automatically send message after speech recognition
    setTimeout(() => {
      sendChatMessage();
    }, 500);
  };

  recognition.onerror = function(event) {
    console.error("Speech Recognition Error: ", event.error);
    stopListening();
    alert("Voice input error or permission denied. Please allow microphone access.");
  };

  recognition.onend = function() {
    stopListening();
  };
}

function startVoiceRecognition() {
  if (!recognition) {
    alert("Your browser does not support Speech Recognition. Please use Google Chrome.");
    return;
  }

  if (isListening) {
    recognition.stop();
    stopListening();
  } else {
    recognition.start();
  }
}

function stopListening() {
  isListening = false;
  const micBtn = document.getElementById('micBtn');
  if (micBtn) micBtn.classList.remove('listening');
  document.getElementById('chatInput').placeholder = "Speak or type your emergency...";
}

// Send Message Functionality
function sendChatMessage() {
  const inputField = document.getElementById('chatInput');
  const userText = inputField.value.trim();

  if (userText === "") return;

  const chatBox = document.getElementById('chatBox');

  // Render User Message
  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble user';
  userBubble.innerHTML = `<p>${userText}</p>`;
  chatBox.appendChild(userBubble);

  inputField.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  // Simulate AI Response
  setTimeout(() => {
    let botReplyText = "I have noted your emergency. Nearby rescue teams and emergency services have been alerted!";
    
    if (userText.toLowerCase().includes("flood") || userText.toLowerCase().includes("rain")) {
      botReplyText = "High water levels detected! Please move to the nearest Government Relief Camp in Peelamedu.";
    } else if (userText.toLowerCase().includes("fire")) {
      botReplyText = "Fire alert! Calling Fire Service (101) and guiding you to the nearest safe open area.";
    } else if (userText.toLowerCase().includes("medical") || userText.toLowerCase().includes("doctor")) {
      botReplyText = "Dispatching Ambulance (108). Stay calm and stay in your current location.";
    }

    const botBubble = document.createElement('div');
    botBubble.className = 'chat-bubble bot';
    botBubble.innerHTML = `
      <i class="fa-solid fa-robot bot-ic"></i>
      <div>
        <b>AI Assistant</b>
        <p>${botReplyText}</p>
      </div>
    `;
    chatBox.appendChild(botBubble);
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 1000);
}

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    sendChatMessage();
  }
}// Open and Close Add Contact Modal
function openAddContactModal() {
  document.getElementById('contactModal').classList.remove('hidden');
}

function closeAddContactModal() {
  document.getElementById('contactModal').classList.add('hidden');
  document.getElementById('newContactName').value = '';
  document.getElementById('newContactPhone').value = '';
}

// Save and Render New Contact Dynamically
function saveNewContact() {
  const nameInput = document.getElementById('newContactName').value.trim();
  const phoneInput = document.getElementById('newContactPhone').value.trim();

  if (nameInput === '' || phoneInput === '') {
    alert('Please enter both name and phone number.');
    return;
  }

  const contactListContainer = document.getElementById('contactListContainer');

  // Create new contact card element
  const newCard = document.createElement('div');
  newCard.className = 'contact-card';
  newCard.innerHTML = `
    <div class="contact-avatar"><i class="fa-solid fa-user"></i></div>
    <div class="contact-details"><h5>${nameInput}</h5><p>${phoneInput}</p></div>
    <a href="tel:${phoneInput}" class="btn-call"><i class="fa-solid fa-phone"></i> Call</a>
  `;

  // Append to list
  contactListContainer.appendChild(newCard);
  contactListContainer.scrollTop = contactListContainer.scrollHeight;

  // Close modal and clear inputs
  closeAddContactModal();
  alert(`Successfully added ${nameInput} to emergency contacts!`);
}// Save and Render New Contact Dynamically (with Delete button included)
function saveNewContact() {
  const nameInput = document.getElementById('newContactName').value.trim();
  const phoneInput = document.getElementById('newContactPhone').value.trim();

  if (nameInput === '' || phoneInput === '') {
    alert('Please enter both name and phone number.');
    return;
  }

  const contactListContainer = document.getElementById('contactListContainer');

  // Create new contact card element with Delete button
  const newCard = document.createElement('div');
  newCard.className = 'contact-card';
  newCard.innerHTML = `
    <div class="contact-avatar"><i class="fa-solid fa-user"></i></div>
    <div class="contact-details"><h5>${nameInput}</h5><p>${phoneInput}</p></div>
    <a href="tel:${phoneInput}" class="btn-call"><i class="fa-solid fa-phone"></i> Call</a>
    <button class="btn-delete" onclick="deleteContact(this)" title="Delete Contact"><i class="fa-solid fa-trash-can"></i></button>
  `;

  // Append to list
  contactListContainer.appendChild(newCard);
  contactListContainer.scrollTop = contactListContainer.scrollHeight;

  // Close modal and clear inputs
  closeAddContactModal();
  alert(`Successfully added ${nameInput} to emergency contacts!`);
}

// Delete Contact Function
function deleteContact(buttonElement) {
  const card = buttonElement.closest('.contact-card');
  if (confirm("Are you sure you want to remove this emergency contact?")) {
    card.remove();
  }
}// Open Alert Details Modal
function openAlertDetail(title, location, description, time) {
  document.getElementById('alertTitle').innerText = title;
  document.getElementById('alertLocation').innerText = location;
  document.getElementById('alertDescription').innerText = description;
  document.getElementById('alertTime').innerText = "Updated: " + time;
  document.getElementById('alertModal').classList.remove('hidden');
}

function closeAlertDetail() {
  document.getElementById('alertModal').classList.add('hidden');
}

// Locate Me (GPS) Feature
function locateUserGPS() {
  if (navigator.geolocation) {
    alert("Fetching your real-time GPS location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        // Live Location View ki switch chesi map lo position mark chestundi
        switchTab(6);
        
        setTimeout(() => {
          if (map !== null) {
            map.setView([lat, lng], 15);
            L.marker([lat, lng]).addTo(map)
              .bindPopup("<b>You are here!</b><br>Real-time GPS Location")
              .openPopup();
          }
        }, 300);
      },
      (error) => {
        alert("Unable to fetch GPS location. Please enable location permissions in your browser.");
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}// Send Message & AI Auto-Reply Function
function sendChatMessage() {
  const inputField = document.getElementById('chatInput');
  const userText = inputField.value.trim();

  if (userText === "") return;

  const chatBox = document.getElementById('chatBox');

  // User Bubble
  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble user';
  userBubble.innerHTML = `<p>${userText}</p>`;
  chatBox.appendChild(userBubble);

  inputField.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  // Colorful AI Simulated Typing / Response
  setTimeout(() => {
    let botReplyText = "I have recorded your alert. Emergency response teams have been notified.";
    
    if (userText.toLowerCase().includes("flood") || userText.toLowerCase().includes("rain")) {
      botReplyText = "⚠️ Heavy water logging detected. Please evacuate to the Government Relief Camp in Peelamedu immediately.";
    } else if (userText.toLowerCase().includes("fire")) {
      botReplyText = "🔥 Fire emergency logged! Dispatching Fire Service (101) to your current coordinates.";
    } else if (userText.toLowerCase().includes("medical") || userText.toLowerCase().includes("ambulance")) {
      botReplyText = "🚑 Ambulance (108) alert triggered. Stay calm, medical personnel are on their way.";
    }

    const botBubble = document.createElement('div');
    botBubble.className = 'chat-bubble bot';
    botBubble.innerHTML = `
      <i class="fa-solid fa-robot bot-ic"></i>
      <div>
        <b>AI Guardian</b>
        <p>${botReplyText}</p>
      </div>
    `;
    chatBox.appendChild(botBubble);
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 800);
}

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    sendChatMessage();
  }
}function triggerSOS() {
  alert('🚨 SOS Triggered! Emergency alert and real-time location sent to contacts.');
}function triggerSOS() {
  alert('🚨 SOS Triggered! Emergency alert and real-time location sent to contacts.');
}// Send Message & AI Auto-Reply Function
function sendChatMessage() {
  const inputField = document.getElementById('chatInput');
  const userText = inputField.value.trim();

  if (userText === "") return;

  const chatBox = document.getElementById('chatBox');

  // User Bubble
  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble user';
  userBubble.innerHTML = `<p>${userText}</p>`;
  chatBox.appendChild(userBubble);

  inputField.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  // AI Response Simulation
  setTimeout(() => {
    let botReplyText = "I have recorded your alert. Emergency response teams have been notified.";
    
    if (userText.toLowerCase().includes("flood") || userText.toLowerCase().includes("rain")) {
      botReplyText = "⚠️ Heavy water logging detected. Please evacuate to the Government Relief Camp in Peelamedu immediately.";
    } else if (userText.toLowerCase().includes("fire")) {
      botReplyText = "🔥 Fire emergency logged! Dispatching Fire Service (101) to your current coordinates.";
    } else if (userText.toLowerCase().includes("medical") || userText.toLowerCase().includes("ambulance")) {
      botReplyText = "🚑 Ambulance (108) alert triggered. Stay calm, medical personnel are on their way.";
    }

    const botBubble = document.createElement('div');
    botBubble.className = 'chat-bubble bot';
    botBubble.innerHTML = `
      <i class="fa-solid fa-robot bot-ic"></i>
      <div>
        <b>AI Assistant</b>
        <p>${botReplyText}</p>
      </div>
    `;
    chatBox.appendChild(botBubble);
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 800);
}

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    sendChatMessage();
  }
}let directionsMap = null;

// Update switchTab function to trigger Directions Map render
function switchTab(tabNum) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(`view-${tabNum}`).classList.add('active');

  const navIcons = document.querySelectorAll('.nav-icon');
  navIcons.forEach(btn => btn.classList.remove('active'));
  
  if (tabNum === 5) navIcons[0]?.classList.add('active');
  if (tabNum === 8) navIcons[1]?.classList.add('active');
  if (tabNum === 10) navIcons[2]?.classList.add('active');
  if (tabNum === 11) navIcons[3]?.classList.add('active');
  if (tabNum === 14) navIcons[4]?.classList.add('active');

  if (tabNum === 6) {
    setTimeout(initMap, 150);
  }
  
  // Directions Screen Open agadaga Map Render aguthe
  if (tabNum === 13) {
    setTimeout(initDirectionsMap, 150);
  }
}

// Render Live Map with Route on Directions Screen
function initDirectionsMap() {
  if (directionsMap !== null) {
    directionsMap.remove();
  }

  // Peelamedu, Coimbatore Coordinates
  const startCoords = [11.025, 76.995]; // Current Location
  const destinationCoords = [11.028, 77.003]; // Relief Camp

  directionsMap = L.map('directionsMap').setView(startCoords, 14);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map &copy; OpenStreetMap'
  }).addTo(directionsMap);

  // User Start Marker
  L.marker(startCoords).addTo(directionsMap)
    .bindPopup('<b>Your Current Location</b>')
    .openPopup();

  // Relief Camp Destination Marker
  L.marker(destinationCoords).addTo(directionsMap)
    .bindPopup('<b>Government Relief Camp</b><br>Peelamedu, Coimbatore');

  // Draw Route Polyline
  const routePolyline = L.polyline([
    startCoords,
    [11.026, 76.998],
    [11.027, 77.001],
    destinationCoords
  ], {
    color: '#ff4757',
    weight: 5,
    opacity: 0.8,
    dashArray: '8, 8'
  }).addTo(directionsMap);

  directionsMap.fitBounds(routePolyline.getBounds(), { padding: [20, 20] });
}

// Start Live Navigation Button Action
function startLiveNavigation() {
  alert('🧭 Starting Live Navigation to Government Relief Camp!');
}// Open Signup Screen
function openSignupScreen() {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-signup').classList.add('active');
}

// Open Login Screen
function openLoginScreen() {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-4').classList.add('active');
}

// Toggle Password for Signup
function toggleRegPassword() {
  const regPassInput = document.getElementById('regPass');
  const regEyeIcon = document.getElementById('toggleRegEye');
  if (regPassInput.type === 'password') {
    regPassInput.type = 'text';
    regEyeIcon.classList.replace('fa-eye-slash', 'fa-eye');
  } else {
    regPassInput.type = 'password';
    regEyeIcon.classList.replace('fa-eye', 'fa-eye-slash');
  }
}

// Handle User Registration
function handleRegistration() {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const pass = document.getElementById('regPass').value.trim();

  if (name === "" || email === "" || pass === "") {
    alert("Please fill in all required fields!");
    return;
  }

  // Set registered user name to top header dynamically
  const userNameElem = document.querySelector('.greeting b');
  if (userNameElem) {
    userNameElem.innerText = name;
  }

  alert("🎉 Account created successfully! Logging you in...");
  nextScreen(5); // Switch to Dashboard
}// Open Forgot Password Screen
function openForgotPasswordScreen() {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-forgot-pwd').classList.add('active');
  
  // Reset steps to Step 1
  document.getElementById('forgotStep1').classList.remove('hidden');
  document.getElementById('forgotStep2').classList.add('hidden');
}

// Toggle New Password Visibility
function toggleNewPassword() {
  const newPassInput = document.getElementById('newPassInput');
  const eyeIcon = document.getElementById('toggleNewEye');
  if (newPassInput.type === 'password') {
    newPassInput.type = 'text';
    eyeIcon.classList.replace('fa-eye-slash', 'fa-eye');
  } else {
    newPassInput.type = 'password';
    eyeIcon.classList.replace('fa-eye', 'fa-eye-slash');
  }
}

// Step 1: Send Reset Code Action
function sendResetCode() {
  const accountVal = document.getElementById('resetAccountInput').value.trim();
  
  if (accountVal === '') {
    alert('Please enter your registered Email or Phone number!');
    return;
  }

  alert(`📩 Verification code sent to ${accountVal}. (Use OTP: 1234)`);
  
  // Switch to Step 2
  document.getElementById('forgotStep1').classList.add('hidden');
  document.getElementById('forgotStep2').classList.remove('hidden');
}

// Step 2: Confirm and Update Password
function confirmResetPassword() {
  const otp = document.getElementById('otpInput').value.trim();
  const newPass = document.getElementById('newPassInput').value.trim();

  if (otp === '' || newPass === '') {
    alert('Please enter both OTP code and your new password!');
    return;
  }

  if (otp !== '1234') {
    alert('Invalid OTP code! Please use 1234.');
    return;
  }

  // Update password in login field
  document.getElementById('loginPass').value = newPass;

  alert('🔒 Password updated successfully! Please login with your new password.');
  openLoginScreen();
}// Open Alert Details Modal
function openAlertDetail(title, location, description, time) {
  document.getElementById('alertTitle').innerText = title;
  document.getElementById('alertLocation').innerText = location;
  document.getElementById('alertDescription').innerText = description;
  document.getElementById('alertTime').innerText = "Updated: " + time;
  document.getElementById('alertModal').classList.remove('hidden');
}

function closeAlertDetail() {
  document.getElementById('alertModal').classList.add('hidden');
}

// Locate Me (GPS) Feature
function locateUserGPS() {
  if (navigator.geolocation) {
    alert("Fetching your real-time GPS location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        // Switch to Live Map screen and mark position
        switchTab(6);
        
        setTimeout(() => {
          if (map !== null) {
            map.setView([lat, lng], 15);
            L.marker([lat, lng]).addTo(map)
              .bindPopup("<b>You are here!</b><br>Real-time GPS Location")
              .openPopup();
          }
        }, 300);
      },
      (error) => {
        alert("Unable to fetch GPS location. Please enable location permissions in your browser.");
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}// Dynamic Relief Camp Search Filter Function
function filterReliefCamps() {
  const input = document.getElementById('reliefSearchInput').value.toLowerCase();
  const campCards = document.querySelectorAll('.relief-camp-card');

  campCards.forEach(card => {
    const text = card.innerText.toLowerCase();
    if (text.includes(input)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}// ==========================================
// AI ASSISTANT AUDIO RECORDING & SPEECH
// ==========================================
let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;
let recordingInterval = null;
let secondsElapsed = 0;

// Toggle Audio Recording (Start / Stop & Send)
function toggleAudioRecording() {
  const recordBtn = document.getElementById('recordAudioBtn');
  const waveBox = document.getElementById('recordingWaveBox');

  if (!isRecording) {
    // Start Recording
    isRecording = true;
    audioChunks = [];
    secondsElapsed = 0;
    
    recordBtn.classList.add('recording');
    waveBox.classList.remove('hidden');
    document.getElementById('chatInput').disabled = true;

    // Start Timer
    document.getElementById('recordingTimer').innerText = "00:00";
    recordingInterval = setInterval(() => {
      secondsElapsed++;
      let mins = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
      let secs = (secondsElapsed % 60).toString().padStart(2, '0');
      document.getElementById('recordingTimer').innerText = `${mins}:${secs}`;
    }, 1000);

    // Request Mic Permission & Record using MediaRecorder API if available
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
          };
          mediaRecorder.onstop = () => {
            sendAudioMessageBubble();
          };
          mediaRecorder.start();
        })
        .catch(err => {
          console.log("Mic access denied or unavailable, using simulated audio recording.");
        });
    }
  } else {
    // Stop & Send Recording
    stopAndSendAudioRecording();
  }
}

function stopAndSendAudioRecording() {
  if (!isRecording) return;
  
  isRecording = false;
  clearInterval(recordingInterval);

  const recordBtn = document.getElementById('recordAudioBtn');
  const waveBox = document.getElementById('recordingWaveBox');

  recordBtn.classList.remove('recording');
  waveBox.classList.add('hidden');
  document.getElementById('chatInput').disabled = false;

  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  } else {
    // Fallback simulation if MediaRecorder isn't active
    sendAudioMessageBubble();
  }
}

function cancelVoiceRecording() {
  if (!isRecording) return;
  
  isRecording = false;
  clearInterval(recordingInterval);

  const recordBtn = document.getElementById('recordAudioBtn');
  const waveBox = document.getElementById('recordingWaveBox');

  recordBtn.classList.remove('recording');
  waveBox.classList.add('hidden');
  document.getElementById('chatInput').disabled = false;

  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
  audioChunks = [];
  alert("❌ Voice recording cancelled.");
}

function sendAudioMessageBubble() {
  const chatBox = document.getElementById('chatBox');
  
  // User Audio Note Bubble
  const audioBubble = document.createElement('div');
  audioBubble.className = 'chat-bubble user audio-note';
  audioBubble.innerHTML = `
    <div class="audio-play-ic" onclick="playAudioNote(this)"><i class="fa-solid fa-play"></i></div>
    <div>
      <b style="font-size: 11px; display: block; margin-bottom: 2px;">Voice Emergency Note</b>
      <span class="audio-waveform-line">▶ ▂▃▅▇ 0:${secondsElapsed < 10 ? '0'+secondsElapsed : secondsElapsed}</span>
    </div>
  `;
  chatBox.appendChild(audioBubble);
  chatBox.scrollTop = chatBox.scrollHeight;

  // AI Response Simulation to Voice Note
  setTimeout(() => {
    const botBubble = document.createElement('div');
    botBubble.className = 'chat-bubble bot';
    botBubble.innerHTML = `
      <i class="fa-solid fa-robot bot-ic"></i>
      <div>
        <b>AI Assistant</b>
        <p>🎙️ Audio note received and analyzed. Emergency rescue unit has been dispatched to your GPS coordinates!</p>
      </div>
    `;
    chatBox.appendChild(botBubble);
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 1000);
}

function playAudioNote(btn) {
  const icon = btn.querySelector('i');
  if (icon.classList.contains('fa-play')) {
    icon.classList.replace('fa-play', 'fa-pause');
    alert("Playing recorded emergency audio note...");
    setTimeout(() => {
      icon.classList.replace('fa-pause', 'fa-play');
    }, 3000);
  } else {
    icon.classList.replace('fa-pause', 'fa-play');
  }
}

// Speech Recognition (Mic Button)
function startSpeechRecognition() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert("Speech recognition is not supported in your browser.");
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  recognition.lang = 'en-US';
  recognition.onstart = function() {
    alert("🎙️ Listening to your emergency voice command...");
  };

  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
      chatInput.value = transcript;
      sendChatMessage();
    }
  };

  recognition.onerror = function() {
    alert("Could not recognize speech. Please try recording audio.");
  };

  recognition.start();
}// ==========================================
// CAMERA STREAM & PROFILE PHOTO CAPTURE LOGIC
// ==========================================
let cameraStream = null;

// Open Camera Stream
function openDeviceCamera() {
  const videoElem = document.getElementById('cameraVideo');
  const imgPreview = document.getElementById('editAvatarPreview');
  const cameraControls = document.getElementById('cameraControls');

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
      .then(stream => {
        cameraStream = stream;
        videoElem.srcObject = stream;
        
        // Show video stream, hide static image
        videoElem.classList.remove('hidden');
        imgPreview.classList.add('hidden');
        cameraControls.classList.remove('hidden');
      })
      .catch(err => {
        alert("📷 Unable to access device camera. Please allow camera permissions in your browser.");
      });
  } else {
    alert("Camera API is not supported in this browser.");
  }
}

// Capture Snapshot from Camera Stream
function captureCameraPhoto() {
  const videoElem = document.getElementById('cameraVideo');
  const canvasElem = document.getElementById('cameraCanvas');
  const imgPreview = document.getElementById('editAvatarPreview');

  if (!cameraStream) return;

  // Set canvas size matching video stream
  canvasElem.width = videoElem.videoWidth || 300;
  canvasElem.height = videoElem.videoHeight || 300;

  const context = canvasElem.getContext('2d');
  context.drawImage(videoElem, 0, 0, canvasElem.width, canvasElem.height);

  // Convert canvas frame to Image Data URL
  const capturedImageData = canvasElem.toDataURL('image/png');
  imgPreview.src = capturedImageData;

  // Stop Camera Stream
  stopDeviceCamera();
}

// Stop Device Camera
function stopDeviceCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }

  const videoElem = document.getElementById('cameraVideo');
  const imgPreview = document.getElementById('editAvatarPreview');
  const cameraControls = document.getElementById('cameraControls');

  if (videoElem) videoElem.classList.add('hidden');
  if (imgPreview) imgPreview.classList.remove('hidden');
  if (cameraControls) cameraControls.classList.add('hidden');
}

// Close Edit Profile Modal (Ensure Camera Closes)
function closeEditProfileModal() {
  stopDeviceCamera();
  const modal = document.getElementById('editProfileModal');
  if (modal) modal.classList.add('hidden');
}// Re-center map to User's Current GPS Location
function panToCurrentLocation() {
  if (map && currentCoords) {
    map.setView([currentCoords.lat, currentCoords.lng], 16, {
      animate: true,
      pan: { duration: 0.8 }
    });
    
    if (userMarker) {
      userMarker.openPopup();
    }
    
    // Optional brief feedback
    console.log(`Centered map to: ${currentCoords.lat}, ${currentCoords.lng}`);
  } else {
    alert("Fetching current location coordinates...");
    fetchUserRealtimeGPS();
  }
}// Open & Close Edit Profile Modal
function openEditProfileModal() {
  document.getElementById('editProfileModal').classList.remove('hidden');
}

function closeEditProfileModal() {
  document.getElementById('editProfileModal').classList.add('hidden');
}

// Profile Image Live Preview
function previewProfileImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('editAvatarPreview').src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

// Save Profile Changes Dynamically
function saveProfileChanges() {
  const newName = document.getElementById('editUserName').value.trim();
  const newLocation = document.getElementById('editUserLocation').value.trim();
  const newAvatarSrc = document.getElementById('editAvatarPreview').src;

  if (newName === "") {
    alert("Name cannot be empty!");
    return;
  }

  // Profile Screen Update
  const profileNameElem = document.querySelector('.profile-user-name');
  if (profileNameElem) profileNameElem.innerText = newName;

  const profileLocationElem = document.querySelector('.profile-user-location');
  if (profileLocationElem) {
    profileLocationElem.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${newLocation}`;
  }

  const profileImgElem = document.querySelector('.profile-user-img');
  if (profileImgElem) profileImgElem.src = newAvatarSrc;

  // Header Bar Update
  const headerNameElem = document.querySelector('.greeting b');
  if (headerNameElem) headerNameElem.innerText = newName;

  const headerLocElem = document.querySelector('.location-tag');
  if (headerLocElem) {
    headerLocElem.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${newLocation}`;
  }

  closeEditProfileModal();
  alert("✨ Profile updated successfully!");
}// Emergency SOS Trigger Function
function triggerSOS() {
  // 1. Long Vibration Pattern (2 Seconds Continuous Vibrate)
  if ("vibrate" in navigator) {
    // 2000ms = 2 seconds long vibration
    navigator.vibrate(2000); 
  }

  // 2. Emergency Contact Number & Message Setup
  // 🔥 Inga unga emergency contact number-a Country Code-oda podunga (e.g., 919876543210)
  const phoneNumber = "919876543210"; 
  
  // Custom Emergency Message
  const emergencyMessage = encodeURIComponent(
    "🚨 EMERGENCY SOS ALERT! 🚨\nI need immediate help! Please track my location or contact me urgently."
  );

  // 3. Open WhatsApp with pre-filled Message
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${emergencyMessage}`;

  // Delay slightly so vibration initiates before app switches
  setTimeout(() => {
    window.open(whatsappUrl, '_blank');
  }, 300);
}let sosTimeout = null;
let countdownInterval = null;

// 1. SOS Button Click pannum pothu 3 Seconds Countdown Start Aagum
function triggerSOS() {
  const modal = document.getElementById('sosModal');
  const timerSpan = document.getElementById('sosTimer');
  if (!modal) return;

  modal.style.display = 'flex';
  let timeLeft = 3;
  timerSpan.innerText = timeLeft;

  // Countdown timer text change panrathuku
  countdownInterval = setInterval(() => {
    timeLeft--;
    if (timerSpan) timerSpan.innerText = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
    }
  }, 1000);

  // Exact 3 seconds wait panni action trigger panrathuku
  sosTimeout = setTimeout(() => {
    closeSOSModal();
    executeSOSAction();
  }, 3000);
}

// 2. User 'CANCEL' Button Click pannina countdown stop aagum
function cancelSOS() {
  clearTimeout(sosTimeout);
  clearInterval(countdownInterval);
  closeSOSModal();
}

// 3. Modal close panra helper function
function closeSOSModal() {
  const modal = document.getElementById('sosModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// 4. 3 seconds mudinju automatic-ah execute aagura action (Vibration & WhatsApp)
function executeSOSAction() {
  // Long Vibration (2 seconds)
  if ("vibrate" in navigator) {
    navigator.vibrate(2000); 
  }

  // Emergency Contact Number & WhatsApp Message
  const phoneNumber = "919876543210"; // Unga number-a inga podunga
  const emergencyMessage = encodeURIComponent(
    "🚨 EMERGENCY SOS ALERT! 🚨\nI need immediate help! Please track my location or contact me urgently."
  );

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${emergencyMessage}`;

  setTimeout(() => {
    window.open(whatsappUrl, '_blank');
  }, 300);
}// Logout User Function
function logoutUser() {
  // Confirmation alert (Optional)
  if (confirm("Are you sure you want to logout?")) {
    
    // Method A: Neenga screens-a switch panra alavula app vachiruntha (e.g., Screen 1 is Login)
    if (typeof nextScreen === 'function') {
      nextScreen(1); // Screen 1-ku pogum
    } 
    
    // Method B: Bottom navigation-a hide panni main app-flow-a hide panra maari iruntha:
    const appFlow = document.getElementById('app-flow');
    if (appFlow) {
      appFlow.classList.add('hidden'); // App container-a hide panrum
    }
    
    // Screen 1 (Login/Intro) active aakkurathuku
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const loginScreen = document.getElementById('screen-1');
    if (loginScreen) {
      loginScreen.classList.add('active');
    }

    // Success feedback (Optional)
    console.log("Logged out successfully.");
  }
}// Logout User Function
function logoutUser() {
  // Confirmation alert (Optional)
  if (confirm("Are you sure you want to logout?")) {
    
    // Method A: Neenga screens-a switch panra alavula app vachiruntha (e.g., Screen 1 is Login)
    if (typeof nextScreen === 'function') {
      nextScreen(1); // Screen 1-ku pogum
    } 
    
    // Method B: Bottom navigation-a hide panni main app-flow-a hide panra maari iruntha:
    const appFlow = document.getElementById('app-flow');
    if (appFlow) {
      appFlow.classList.add('hidden'); // App container-a hide panrum
    }
    
    // Screen 1 (Login/Intro) active aakkurathuku
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const loginScreen = document.getElementById('screen-1');
    if (loginScreen) {
      loginScreen.classList.add('active');
    }

    // Success feedback (Optional)
    console.log("Logged out successfully.");
  }
}// Safe Zone / Destination Coordinates (Example: Coimbatore Central Relief Camp)
const destLat = 11.0168;
const destLng = 76.9558;

// 1. Distance Calculate Panra Function (Haversine Formula)
function calculateDistance() {
  if ("geolocation" in navigator) {
    const distanceElem = document.getElementById('distanceText');
    if (distanceElem) distanceElem.innerText = "Calculating...";

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat1 = position.coords.latitude;
        const lon1 = position.coords.longitude;
        
        // Haversine formula logic for distance in kilometers
        const R = 6371; // Earth radius in KM
        const dLat = deg2rad(destLat - lat1);
        const dLon = deg2rad(destLng - lon1);
        
        const a = 
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(destLat)) * 
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
          
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance value in KM

        // Update UI text
        if (distanceElem) {
          distanceElem.innerText = distance.toFixed(2) + " km away";
        }
      },
      (error) => {
        alert("Unable to fetch location for distance calculation. Please enable GPS.");
        if (distanceElem) distanceElem.innerText = "Error";
      },
      { enableHighAccuracy: true }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}

// Degree to Radian conversion helper
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// 2. Google Maps Turn-by-Turn Navigation Open Panra Function
function openGoogleNavigation() {
  // Opens direct Google Maps Navigation app/web page with driving directions
  const googleNavUrl = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=driving`;
  window.open(googleNavUrl, '_blank');
}// Profile Image Preview Function
function previewProfileImage(event) {
  const reader = new FileReader();
  reader.onload = function() {
    const preview = document.getElementById('avatarPreview');
    const icon = document.getElementById('avatarIcon');
    if (preview) {
      preview.src = reader.result;
      preview.style.display = 'block';
    }
    if (icon) {
      icon.style.display = 'none';
    }
  };
  if (event.target.files[0]) {
    reader.readAsDataURL(event.target.files[0]);
  }
}

// Save Profile Form Logic
function saveProfileDetails(event) {
  event.preventDefault();

  const profileData = {
    name: document.getElementById('editName').value,
    phone: document.getElementById('editPhone').value,
    emergencyPhone: document.getElementById('editEmergencyPhone').value,
    bloodGroup: document.getElementById('editBloodGroup').value,
    age: document.getElementById('editAge').value,
    address: document.getElementById('editAddress').value,
    medicalNotes: document.getElementById('editMedicalNotes').value
  };

  // Save to localStorage so details remain after refresh
  localStorage.setItem('userProfile', JSON.stringify(profileData));

  alert("Profile details saved successfully!");

  // Optional: Redirect back to Profile View (e.g. view-14)
  if (typeof switchTab === 'function') {
    switchTab(14); // Return to main profile view
  }
}

// Load saved details on startup
window.addEventListener('DOMContentLoaded', () => {
  const savedData = localStorage.getItem('userProfile');
  if (savedData) {
    const data = JSON.parse(savedData);
    if (document.getElementById('editName')) document.getElementById('editName').value = data.name || '';
    if (document.getElementById('editPhone')) document.getElementById('editPhone').value = data.phone || '';
    if (document.getElementById('editEmergencyPhone')) document.getElementById('editEmergencyPhone').value = data.emergencyPhone || '';
    if (document.getElementById('editBloodGroup')) document.getElementById('editBloodGroup').value = data.bloodGroup || 'O+';
    if (document.getElementById('editAge')) document.getElementById('editAge').value = data.age || '';
    if (document.getElementById('editAddress')) document.getElementById('editAddress').value = data.address || '';
    if (document.getElementById('editMedicalNotes')) document.getElementById('editMedicalNotes').value = data.medicalNotes || '';
  }
});// Logout Handling & Switch to Sign-In
function handleLogout() {
    // Hide all view screens
    document.querySelectorAll('.app-view').forEach(view => {
        view.classList.add('hidden');
    });

    // Hide Bottom Navbar
    const bottomNav = document.querySelector('.bottom-nav');
    if (bottomNav) {
        bottomNav.style.display = 'none';
    }

    // Show Sign-In Screen
    const signinView = document.getElementById('signinView');
    if (signinView) {
        signinView.classList.remove('hidden');
    }
}// Logout Handling & Switch to Sign-In Screen
function handleLogout() {
    // Hide all view screens
    document.querySelectorAll('.app-view').forEach(view => {
        view.classList.add('hidden');
    });

    // Hide Bottom Nav Bar
    const bottomNav = document.querySelector('.bottom-nav');
    if (bottomNav) {
        bottomNav.style.display = 'none';
    }

    // Show Sign-In Screen
    const signinView = document.getElementById('signinView');
    if (signinView) {
        signinView.classList.remove('hidden');
    }
}function openSafetyHubView() {
    // Hide all views
    document.querySelectorAll('.view, .app-view').forEach(el => {
        el.classList.add('hidden');
        el.style.display = 'none';
    });

    // Remove active tab highlights
    document.querySelectorAll('.bottom-navbar button, .bottom-nav button').forEach(btn => {
        btn.classList.remove('active');
    });

    // Open Safe Zone View smoothly
    const safeZone = document.getElementById('safeZoneView');
    if (safeZone) {
        safeZone.classList.remove('hidden');
        safeZone.style.display = 'block';
    }
}function openSafetyHubView() {
    // Hide all existing view divs
    const allViews = document.querySelectorAll('.view, .app-view, [id^="view-"]');
    allViews.forEach(v => {
        v.classList.add('hidden');
        v.style.display = 'none';
    });

    // Show Safe Zone View directly
    const safeZone = document.getElementById('safeZoneView');
    if (safeZone) {
        safeZone.classList.remove('hidden');
        safeZone.style.display = 'block';
    } else {
        console.error("safeZoneView element create aagala / kidaikkala!");
    }
}function openSafetyHubView() {
    // Hide all existing view divs
    const allViews = document.querySelectorAll('.view, .app-view, [id^="view-"]');
    allViews.forEach(v => {
        v.classList.add('hidden');
        v.style.display = 'none';
    });

    // Show Safe Zone View directly
    const safeZone = document.getElementById('safeZoneView');
    if (safeZone) {
        safeZone.classList.remove('hidden');
        safeZone.style.display = 'block';
    } else {
        console.error("safeZoneView element create aagala / kidaikkala!");
    }
}// Open Folder Modal (Strictly restricted to Safe Zone Screen only)
function openFolderDetails(type) {
    // Check if Safe Zone screen is currently active/visible
    const safeZoneView = document.getElementById('safeZoneView');
    const isSafeZoneActive = safeZoneView && !safeZoneView.classList.contains('hidden') && safeZoneView.style.display !== 'none';

    // If not on Safe Zone screen, exit immediately
    if (!isSafeZoneActive) {
        return;
    }

    const data = emergencyFolderData[type];
    if (!data) return;

    // Set Modal Header
    document.getElementById('folderModalTitle').innerText = data.title;
    const iconEl = document.getElementById('folderModalIcon');
    iconEl.className = `fa-solid ${data.icon}`;
    iconEl.style.color = data.iconColor;

    // Populate List Items
    const listContainer = document.getElementById('folderModalList');
    listContainer.innerHTML = '';

    data.items.forEach(item => {
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.query)}`;
        
        const card = document.createElement('div');
        card.style.cssText = "background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 12px; display: flex; align-items: center; justify-content: space-between;";
        
        card.innerHTML = `
            <div>
                <div style="font-size: 14px; font-weight: 700; color: #ffffff;">${item.name}</div>
                <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">
                    <i class="fa-solid fa-location-dot" style="color: #ef4444;"></i> ${item.distance} away
                </div>
            </div>
            <div style="display: flex; gap: 8px;">
                <a href="tel:${item.phone}" style="background: #22c55e; color: #ffffff; width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; text-decoration: none;">
                    <i class="fa-solid fa-phone" style="font-size: 14px;"></i>
                </a>
                <a href="${mapsUrl}" target="_blank" style="background: #3b82f6; color: #ffffff; width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; text-decoration: none;">
                    <i class="fa-solid fa-diamond-turn-right" style="font-size: 14px;"></i>
                </a>
            </div>
        `;
        listContainer.appendChild(card);
    });

    // Show Modal strictly inside Safe Zone view
    const modal = document.getElementById('folderModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }
}// Universal Tab Switcher & Back Button Handler
function switchTab(tabId) {
    // 1. Hide all views and modals completely
    document.querySelectorAll('.view, .app-view, [id^="view-"]').forEach(v => {
        v.classList.add('hidden');
        v.style.display = 'none';
    });

    // Also hide safe zone view explicitly
    const safeZone = document.getElementById('safeZoneView');
    if (safeZone) {
        safeZone.classList.add('hidden');
        safeZone.style.display = 'none';
    }

    // 2. Remove active state from all bottom nav buttons
    document.querySelectorAll('.bottom-navbar button, .bottom-nav button').forEach(btn => {
        btn.classList.remove('active');
    });

    // 3. Find and show target view (Default to Home/view-5 if number or missing)
    let targetView = null;
    if (typeof tabId === 'number') {
        targetView = document.getElementById('view-' + tabId);
    } else {
        targetView = document.getElementById(tabId) || document.getElementById(tabId + 'View');
    }

    // Fallback if view-5 or target not found
    if (!targetView) {
        targetView = document.getElementById('view-5') || document.querySelector('.view');
    }

    if (targetView) {
        targetView.classList.remove('hidden');
        targetView.style.display = 'block';
    }
}let mapInstance = null;

function openMapView() {
    // Ellaa views-um hide madi
    document.querySelectorAll('.view, .app-view').forEach(v => {
        v.classList.add('hidden');
        v.style.display = 'none';
    });

    // Map view-6 show madi
    const mapView = document.getElementById('view-6');
    if (mapView) {
        mapView.classList.remove('hidden');
        mapView.style.display = 'block';

        setTimeout(() => {
            let lat = 11.0168; // Coimbatore Latitude
            let lng = 76.9558; // Coimbatore Longitude

            if (!mapInstance) {
                mapInstance = L.map('map').setView([lat, lng], 14);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '© OpenStreetMap'
                }).addTo(mapInstance);

                L.marker([lat, lng]).addTo(mapInstance)
                    .bindPopup("<b>Coimbatore Safe Zone</b>")
                    .openPopup();
            } else {
                mapInstance.invalidateSize(); // Blank tile error-ni sari madutte
            }
        }, 300);
    }
}function openMapView() {
    // 1. Hide ALL views completely
    document.querySelectorAll('.view, .app-view, [id^="view-"]').forEach(v => {
        v.classList.add('hidden');
        v.style.display = 'none';
    });

    // 2. Force show view-6 (Map Screen)
    const mapView = document.getElementById('view-6');
    if (mapView) {
        mapView.classList.remove('hidden');
        mapView.style.display = 'block';
        mapView.style.zIndex = '9999'; // Bring on top
    } else {
        console.error("view-6 not found!");
    }
}// Function to handle openMapView and track Current GPS Location
function openMapView() {
    // Hide all views
    document.querySelectorAll('.view, .app-view, [id^="view-"]').forEach(v => {
        v.classList.add('hidden');
        v.style.display = 'none';
    });

    // Display view-6
    const mapView = document.getElementById('view-6');
    if (mapView) {
        mapView.classList.remove('hidden');
        mapView.style.display = 'block';
    }

    // Trigger GPS location fetching
    getUserGPSLocation();
}

function getUserGPSLocation() {
    const coordsEl = document.getElementById('currentLocCoords');
    const badgeEl = document.getElementById('gpsStatusBadge');
    
    if (navigator.geolocation) {
        if(coordsEl) coordsEl.innerText = "Locating GPS...";
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude.toFixed(4);
                const lng = position.coords.longitude.toFixed(4);

                // Update text coordinates
                if(coordsEl) coordsEl.innerText = `${lat}° N, ${lng}° E`;
                if(badgeEl) {
                    badgeEl.innerText = "GPS ACTIVE";
                    badgeEl.style.background = "#22c55e";
                }

                // Update Dynamic Map Image URL based on current live lat/lng
                const mapImg = document.getElementById('staticMapImg');
                if(mapImg) {
                    mapImg.src = `https://static-maps.yandex.ru/1.x/?lang=en-US&ll=${lng},${lat}&z=15&l=map&size=600,450&pt=${lng},${lat},pm2rdm`;
                }

                // Update Google Maps Link
                const mapLink = document.getElementById('gmapsExternalLink');
                if(mapLink) {
                    mapLink.href = `https://maps.google.com/?q=${lat},${lng}`;
                }
            },
            (error) => {
                console.warn("GPS Access Error: ", error.message);
                if(coordsEl) coordsEl.innerText = "11.0168° N, 76.9558° E (Coimbatore Default)";
                if(badgeEl) {
                    badgeEl.innerText = "GPS OFF";
                    badgeEl.style.background = "#f59e0b";
                }
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }
}function shareLocationOnWhatsApp() {
    // Default Coimbatore coordinates or dynamic ones if available
    let lat = "11.0168";
    let lng = "76.9558";

    // Try getting live coords if available from earlier GPS function
    const coordsText = document.getElementById('currentLocCoords');
    if (coordsText && coordsText.innerText.includes("° N")) {
        // You can parse it or use active coordinates if stored in a variable
    }

    // Construct WhatsApp message with Google Maps link
    let message = `🚨 *ResQNow Emergency Alert!*%0AMy current live GPS location:%0Ahttps://maps.google.com/?q=${lat},${lng}%0A%0APlease check my location immediately!`;
    
    // Open WhatsApp Share URL
    let whatsappUrl = `https://api.whatsapp.com/send?text=${message}`;
    window.open(whatsappUrl, '_blank');
}let currentLat = "11.0168";
let currentLng = "76.9558";

// Fetch Live Coordinates & Update Static Map Image
function getUserGPSLocation() {
    const coordsText = document.getElementById('currentLocCoords');
    const mapImg = document.getElementById('staticMapImg');
    
    if (navigator.geolocation) {
        if (coordsText) coordsText.innerText = "SCANNING GPS...";
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                currentLat = pos.coords.latitude.toFixed(4);
                currentLng = pos.coords.longitude.toFixed(4);
                if (coordsText) coordsText.innerText = `${currentLat}° N, ${currentLng}° E`;
                
                if (mapImg) {
                    mapImg.src = `https://static-maps.yandex.ru/1.x/?lang=en-US&ll=${currentLng},${currentLat}&z=14&l=map&size=600,400&pt=${currentLng},${currentLat},pm2rdm`;
                }
            },
            (err) => {
                if (coordsText) coordsText.innerText = "11.0168° N, 76.9558° E";
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }
}

// Open Direct Google Maps When Clicked
function openInGoogleMaps() {
    let gmapsUrl = `https://www.google.com/maps?q=${currentLat},${currentLng}`;
    window.open(gmapsUrl, '_blank');
}

// WhatsApp Location Sharing Function
function shareLiveLocationOnWhatsApp() {
    let message = `🚨 *ResQNow Emergency Alert!*%0AMy current live GPS location is:%0Ahttps://maps.google.com/?q=${currentLat},${currentLng}%0A%0APlease check my location immediately!`;
    let whatsappUrl = `https://api.whatsapp.com/send?text=${message}`;
    window.open(whatsappUrl, '_blank');
}// 3. Option 2: Share Live Location via WhatsApp (Direct Redirect Fix)
function shareToWhatsApp() {
    try {
        let message = `🚨 *ResQNow Emergency Alert!*%0AMy current live GPS location is:%0Ahttps://maps.google.com/?q=${currentLat},${currentLng}%0A%0APlease check my location immediately!`;
        let whatsappUrl = `https://api.whatsapp.com/send?text=${message}`;
        
        // This direct location assignment bypasses mobile browser pop-up blockers 100%
        window.location.href = whatsappUrl;
    } catch (e) {
        console.log("WhatsApp Error: ", e);
    }
}// Open Google Maps Real-Time Navigation to Relief Camp
function openReliefCampNavigation(destLat, destLng) {
    try {
        let navUrl = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=driving`;
        window.open(navUrl, '_blank');
    } catch (e) {
        console.log("Navigation Error: ", e);
    }
}