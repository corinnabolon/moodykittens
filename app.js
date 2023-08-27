let kittens = []

let kittenImages = []

let overLimitMessage = "You've reached your kitten limit!"
let sameNameMessage ="This name is already taken."

for (let i = 1; i < 13; i++){
   kittenImages.push(`<img src="images/kitten${i}.png" height="90" alt="Kitten Image">`)
 };

/**
 * Called when submitting the new Kitten Form
 * This method will pull data from the form
 * use the provided function to give the data an id
 * then add that data to the kittens list.
 * Then reset the form
 */
function addKitten(event) {
  event.preventDefault()
  let form = event.target

  for (i = 0; i < kittens.length; i++) {
    let kitten = kittens[i]
    if (kitten.name === form.name.value) {
      form.reset()
      showNotification(sameNameMessage)
      return
    }
  }

  let picNum = Math.floor(Math.random() * kittenImages.length)  /*Chooses a random number up to the number of pictures in the array of pictures*/
  let kittenPic = kittenImages.splice(picNum, 1)  /*splice deletes the picNum from the array (1 indicates to only delete 1 item), AND splice returns an array containing only the deleted element(s) which is why that is saved to kittenPic)  */

  if (kittens.length === 12) {
    showNotification(overLimitMessage)
    document.getElementById("kitten-input").classList.add("hidden")
    document.getElementById("kitten-button").classList.add("ishidden")
    document.getElementById("clearKittens1").classList.remove("hidden")
    return
  }
  
  let initialAffection = Math.floor(Math.random() * 4 + 3) 

  let newKitten = {
    id: generateId(),
    name: form.name.value,
    affection: initialAffection,
    mood: undefined,
    pic: kittenPic
  }

  kittens.push(newKitten)
  setKittenMood(newKitten)
  saveKittens()

  document.getElementById("addKittenMessage").classList.add("hidden")
  form.reset()
}

/**
 * Converts the kittens array to a JSON string then
 * Saves the string to localstorage at the key kittens 
 */
function saveKittens() {
  window.localStorage.setItem("kittens", JSON.stringify(kittens))
  drawKittens()
}

/**
 * Attempts to retrieve the kittens string from localstorage
 * then parses the JSON string into an array. Finally sets
 * the kittens array to the retrieved array
 */
function loadKittens() {
  let savedKittens = JSON.parse(window.localStorage.getItem("kittens"))
  if (savedKittens) {
    kittens = savedKittens
  }
}

/**
 * Draw all of the kittens to the kittens element
 */
function drawKittens() {
  let kittenListElement = document.getElementById("kittens")
  let kittensTemplate = " "
  kittens.forEach(kitten => {
    if (kitten.mood == "gone") {
      kittensTemplate += `
      <div id="kitten-card" class="card forkittens m-3 mb-2 text-center kitten gone bg-dark">
        <span class="kitten img ${kitten.mood}" id="kittenPic">${kitten.pic}</span>
        <div class="text-left text-danger m-3 font-rocksalt">
          <p>Name: ${kitten.name}</p>
          <p>Gone: Ran Away</p>
        </div>
        </div>
    `} else {
      kittensTemplate += `
      <div id="kitten-card" class="card forkittens m-3 text-center kitten">
        <span class="kitten img ${kitten.mood}" id="kittenPic">${kitten.pic}</span>
        <div class="text-left m-3 font-quicksand">
          <p>Name: ${kitten.name}</p>
          <p>Mood: ${kitten.mood}</p>
          <p>Affection: ${kitten.affection}</p>
        </div>
        <div class="d-flex space-around">
          <button class="danger" onclick="pet('${kitten.id}')">PET</button>
          <button onclick="catnip('${kitten.id}')">CATNIP</button>
        </div>
      </div>
    `}
  })
    kittenListElement.innerHTML = kittensTemplate
}



/**
 * Find the kitten in the array by its id
 * @param {string} id 
 * @return {Kitten}
 */
function findKittenById(id) {
  for (let i = 0; i < kittens.length; i++) {
    if (id == kittens[i].id) {
      return kittens[i]
    }
  }
}


/**
 * Find the kitten in the array of kittens
 * Generate a random Number
 * if the number is greater than .5 
 * increase the kittens affection
 * otherwise decrease the affection
 * @param {string} id 
 */
function pet(id) {
  pettedKitten = findKittenById(id)
  let affectionChange = Math.floor(Math.random() * 10)
  
  if (affectionChange > 5) {
    pettedKitten.affection ++
  } else {
    pettedKitten.affection --
  }
  setKittenMood(pettedKitten)
  saveKittens()
}

/**
 * Find the kitten in the array of kittens
 * Set the kitten's mood to tolerant
 * Set the kitten's affection to 5
 * @param {string} id
 */
function catnip(id) {
  catnippedKitten = findKittenById(id)
  catnippedKitten.affection = 5
  setKittenMood(catnippedKitten)
  saveKittens()
}

/**
 * Sets the kittens mood based on its affection
 * @param {Kitten} kitten 
 */
function setKittenMood(kitten) {
  if (kitten.affection <= 3 && kitten.affection > 0) {
    kitten.mood = "angry"
  } else if (kitten.affection >= 4 && kitten.affection <= 6) {
    kitten.mood = "tolerant"
  } else if (kitten.affection > 6) {
    kitten.mood = "happy"
  } else {
    kitten.mood = "gone"
  }
}

/**
 * Removes all of the kittens from the array
 * remember to save this change
 */
function clearKittens(){
  kittens = []
  saveKittens()
  document.getElementById("startButton").innerText = "Get Started"
  document.getElementById("clearKittens2").classList.add("hidden")
}


function clearKittensandRestart(){
  kittens = []
  saveKittens()
  location.reload()
}

/**
 * Removes the welcome content and should probably draw the 
 * list of kittens to the page. Good Luck
 */
function getStarted() {
  document.getElementById("welcome").remove();
  if (kittens.length === 12) {
    showNotification(overLimitMessage)
    document.getElementById("kitten-button").classList.add("ishidden")
    document.getElementById("kitten-input").classList.add("hidden")
    document.getElementById("clearKittens1").classList.remove("hidden")
  } else if (kittens.length === 0) {
    document.getElementById("addKittenMessage").classList.remove("hidden")
    document.getElementById("kitten-input").classList.remove("hidden")
    document.getElementById("kitten-button").classList.remove("hidden")
  } else {
    document.getElementById("kitten-input").classList.remove("hidden")
    document.getElementById("kitten-button").classList.remove("hidden")
  }
  drawKittens();
}

/**
 *  Puts notifications under the input form in the same place
 *  
 */
function showNotification(message) {
  document.getElementById("notification").textContent = message
  document.getElementById("notification").classList.remove("ishidden")
  setTimeout(() => {
      document.getElementById("notification").classList.add("ishidden")
    }, 3000)
}
// --------------------------------------------- No Changes below this line are needed

/**
 * Defines the Properties of a Kitten
 * @typedef {{id:sting, name: string, mood: string, affection: number}} Kitten
 */


/**
 * Used to generate a random string id for mocked
 * database generated Id
 * @returns {string}
 */
function generateId() {
  return Math.floor(Math.random() * 10000000) + "-" + Math.floor(Math.random() * 10000000)
}

loadKittens();

if (kittens.length > 0) {
  document.getElementById("startButton").innerText = "Continue Playing"
  document.getElementById("clearKittens2").classList.remove("hidden")
  document.getElementById("clearKittens2").innerText = `Clear ${kittens.length} Kittens`
}
