const socket = io("http://localhost:8080", {
  transports: ["websocket", "polling", "flashsocket"],
});

const container = document.createElement("div");
container.className = "container";

const renderPhoto = (photo) => {
  let content = document.createElement("div");
  content.className = "photo";
  let img = document.createElement("img");
  img.src = photo.thumbnailUrl;

  let albumId = document.createElement("p");
  albumId.textContent = `Album: ${photo.albumId}`;
  let id = document.createElement("p");
  id.textContent = `Photo: ${photo.id}`;
  let title = document.createElement("p");
  title.textContent = photo.title;

  content.appendChild(img);
  content.appendChild(albumId);
  content.appendChild(id);
  content.appendChild(title);

  container.appendChild(content);
};

document.body.append(container);

socket.on("sendPhoto", (message) => {
  renderPhoto(message);
});
