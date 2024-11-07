function canvas_to_tiles(canvas, tiles_v, tiles_h)
{
	let tile_width = canvas.width / tiles_h;
	let tile_height = canvas.height / tiles_v;
	
	let tiles = [];
	for (let y = 0; y < tiles_v; y++)
	{
		for (let x = 0; x < tiles_h; x++)
		{
			let tile_canvas = document.createElement("canvas");
			tile_canvas.width = tile_width;
			tile_canvas.height = tile_height;
			let tile_context = tile_canvas.getContext("2d");
			tile_context.drawImage(
				canvas,
				tile_width * x, tile_height * y, tile_width, tile_height,
				0, 0, tile_canvas.width, tile_canvas.height
			);

			tiles.push([y * tiles_h + x, tile_canvas]);
		}   
	}

	return tiles;
}

function shuffle_array(array)
{
	for (let i = array.length - 1; i > 0; i--)
	{
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}

	return array;
}

function is_solved(container)
{
	for (const tile_slot of container.children)
	{
		if (tile_slot.childElementCount === 0)
		{
			return false;
		}

		map_tile = tile_slot.getElementsByClassName("map-tile")[0];

		slot_index = tile_slot.id.split("-").at(-1);
		map_tile_index = map_tile.id.split("-").at(-1);

		if (slot_index !== map_tile_index)
		{
			return false;
		}
	}

	return true;
}

let tile_count_v = 2;
let tile_count_h = 2;

let correct_tiles = Array(tile_count_v * tile_count_h);

let interactive_map_tile = document.getElementById("interactive-map-tile");
let drop_area = document.getElementById("drop-area");
let puzzle_container = document.getElementById("scrambled-map-tile");

let map = L.map("map", {preferCanvas: true}).setView([0.0, 0.0], 1);

L.tileLayer.provider("Esri.WorldStreetMap").addTo(map);
L.tileLayer.renderer = L.canvas();

document.getElementById("download-button").addEventListener("click", () => {
	leafletImage(map, (err, canvas) => {
		let downloaded_map_canvas = document.createElement("canvas");
		downloaded_map_canvas.width = interactive_map_tile.clientWidth;
		downloaded_map_canvas.height = interactive_map_tile.clientHeight;
		
		let canvas_context = downloaded_map_canvas.getContext("2d");

		canvas_context.drawImage(
			canvas,
			0, 0, downloaded_map_canvas.width, downloaded_map_canvas.height
		);

		puzzle_container.replaceChildren();
		drop_area.replaceChildren();

		let tiles = canvas_to_tiles(downloaded_map_canvas, tile_count_v, tile_count_h);
		shuffle_array(tiles);
		let slot_number = 0;
		for (let [tile_number, tile_canvas] of tiles)
		{
			let tile_slot = document.createElement("div");
			tile_slot.className = "map-tile-slot";
			tile_slot.id = "slot-" + slot_number++;
			tile_slot.style.width = tile_canvas.width.toString() + "px";;
			tile_slot.style.height = tile_canvas.height.toString() + "px";;

			drop_area.appendChild(tile_slot);

			tile_slot.addEventListener("dragover", (event) => {
				event.preventDefault();
			});

			tile_slot.addEventListener("dragenter", (event) => {
				event.currentTarget.style.background = "gray";
			});

			tile_slot.addEventListener("dragleave", (event) => {
				event.currentTarget.style.background = "transparent";
			});

			tile_slot.addEventListener("drop", (event) => {
				event.preventDefault();

				event.currentTarget.style.background = "transparent";
				
				let dragged_tile = document.getElementById(event.dataTransfer.getData("text/plain"));
				
				if (event.currentTarget.childElementCount === 1)
				{
					let dragged_parent = dragged_tile.parentNode;
					if (dragged_parent == event.currentTarget)
					{
						return;
					}

					let tmp_element = document.createElement("div");
					dragged_parent.replaceChild(tmp_element, dragged_tile);
					let target_child = event.currentTarget.children[0];
					event.currentTarget.replaceChild(dragged_tile, target_child)
					dragged_parent.replaceChild(target_child, tmp_element);
				}
				else
				{
					dragged_tile.parentNode.removeChild(dragged_tile);
					event.currentTarget.appendChild(dragged_tile);
				}

				if (!is_solved(drop_area))
				{
					console.log("Not solved");
				}
				else
				{
					console.log("Solved");

					if (Notification.permission === "default")
					{
						Notification.requestPermission();
					}

					new Notification("Puzzle", { body: "Congratulations! You solved the puzzle." });
				}
			});

			let tile = document.createElement("div");
			tile.className = "map-tile";
			tile.setAttribute("draggable", "true")
			tile.appendChild(tile_canvas);
			tile.style.width =  tile_canvas.width.toString() + "px";
			tile.style.height = tile_canvas.height.toString() + "px";
			tile.id = "tile-" + tile_number;

			puzzle_container.appendChild(tile);

			tile.addEventListener("dragstart", (event) => {
				event.dataTransfer.setData("text/plain", event.target.id);
			});
		}

	});
});

document.getElementById("location-button").addEventListener("click", (event) => {
	if (!navigator.geolocation)
	{
		console.log("No geolocation.");
	}

	navigator.geolocation.getCurrentPosition(position => {
		console.log(position);
		let lat = position.coords.latitude;
		let lon = position.coords.longitude;

		map.setView([lat, lon], 14);

		L.marker([lat, lon]).addTo(map);
	}, 
	positionError => {
		console.error(positionError);
	});
});