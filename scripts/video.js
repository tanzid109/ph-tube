//1 - fetch ,load and show categories on html
//create loadCategories
function getTimeString(time) {
  const hour = parseInt(time / 3600);
  let remainingSecond = time % 3600;
  const minute = parseInt(remainingSecond / 60);
  remainingSecond = remainingSecond % 60;
  return `${hour} hour ago ${minute} minute ${remainingSecond} second ago`;
}

const loadCategories = () => {
  //fetch the data;
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories))
    .catch((error) => console.log(error));
};

//create videos
const loadVideos = (searchText ="") => {
  //fetch the data;
  fetch(
    `https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`
  )
    .then((res) => res.json())
    .then((data) => displayVideos(data.videos))
    .catch((error) => console.log(error));
};

const removeActiveClass = () => {
  const buttons = document.getElementsByClassName("category-btn");
  console.log(buttons);
  for (let btn of buttons) {
    btn.classList.remove("active");
  }
};

const loadCategoryVideos = (id) => {
  // alert(id);
  //fetch
  fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
      //sobaike active class remove korao
      removeActiveClass();
      //id er class k active kora
      const activeBtn = document.getElementById(`btn-${id}`);
      activeBtn.classList.add("active");
      displayVideos(data.category);
    })
    .catch((error) => console.log(error));
};
const loadDetails =async (videoId) => {
  console.log(videoId);
  const uri = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
  const res = await fetch(uri);
  const data =await res.json();
  displayDetails(data.video)
};
const displayDetails = (video)=>{
  console.log(video);
  const detailsCOntainer = document.getElementById("modal-content");
  detailsCOntainer.innerHTML=`
  <img src=${video.thumbnail} class="h-1/2 w-full"/>
  <p class="text-xs font-normal p-2 text-center">${video.description}</p>
  `

  //way -1 modal show
  // document.getElementById("showModalData").click();

  //way-2 modal show
  document.getElementById("customModal").showModal();

};

//display videos
const displayVideos = (videos) => {
  const videoContainer = document.getElementById("videos");
  videoContainer.innerHTML = "";

  if (videos.length == 0) {
    console.log("no data");
    videoContainer.classList.remove("grid");
    videoContainer.innerHTML = `
    <div class="min-h[300px] w-full flex flex-col gap-5 justify-center items-center">
    <img src="/assets/Icon.png" />
    <h2 class="text-xl font-bold text-center">Opps!Sorry,There is no <br> content here </h2>
    </div>
    `;
    return;
  } else {
    videoContainer.classList.add("grid");
  }

  videos.forEach((video) => {
    // console.log(video);
    const card = document.createElement("div");
    card.classList = "card card-compact";
    card.innerHTML = `
      <figure class="h-[200px] relative">
        <img
        src=${video.thumbnail} class="h-full w-full object-cover"
        alt="thumbnail" />
        ${
          video.others.posted_date?.length == 0
            ? ""
            : `<span class="absolute right-2 bottom-2 bg-black rounded p-1 text-white text-xs">${getTimeString(
                video.others.posted_date
              )}
            </span>`
        }
      </figure>
  <div class="px-0 py-2 flex gap-2 items-center">
    <div>
      <img class="w-10 h-10 rounded-full object-cover" src="${
        video.authors[0].profile_picture
      }"/>
    </div>
    <div>
      <h2 class="font-bold">${video.title}</h2>
      <div class="flex items-center gap-2">
        <p class="text-gray-400">${video.authors[0].profile_name}</p>
        ${
          video.authors[0].verified === true
            ? '<img class="w-5"  src="https://img.icons8.com/?size=48&id=98A4yZTt9abw&format=png"/>'
            : ""
        } 
      </div>
      <p><button onclick="loadDetails('${video.video_id}')" class="btn btn-sm btn-outline hover:bg-red-500 mt-2">Details</button></p>
    </div>
  </div>
        `;
    videoContainer.append(card);
  });
};

//display categories

const displayCategories = (categories) => {
  const categoryContainer = document.getElementById("categories");

  //add Data in Html
  categories.forEach((item) => {
    console.log(item);

    //create a buton
    const buttonContainer = document.createElement("div");
    buttonContainer.innerHTML = `
      <button id="btn-${item.category_id}" onclick="loadCategoryVideos(${item.category_id})" class="btn category-btn" >
      ${item.category}
      </button>
    `;
    // button.onclick = () =>{
    //   alert("hello")
    // }
    categoryContainer.append(buttonContainer);
  });
};
document.getElementById("search-input").addEventListener("keyup",(e)=>{
  loadVideos(e.target.value);
});
loadCategories();
loadVideos();
