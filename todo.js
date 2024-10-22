class todo_widget
{
	constructor(widget_id)
	{
		this.widget_id = widget_id
		let html_widget = document.getElementById(widget_id);
		
		this.search_bar_id = html_widget.getElementsByClassName("todo-search-bar")[0].id;
		this.list_id = html_widget.getElementsByClassName("todo-list")[0].id;
		this.add_task_id = html_widget.getElementsByClassName("todo-new-task")[0].id;
		this.tasks = []
		this.storage_name = "todo-tasks-data";
		this.search_term = ""

		this.storage_load();
		this.update_html();

		let html_add_task = document.getElementById(this.add_task_id);
		let html_add_button = html_add_task.getElementsByClassName("todo-add-button")[0];
		html_add_button.addEventListener("click", () => {
			let html_task_name_input = html_add_task.getElementsByClassName("todo-task-name-input")[0];
			let html_task_datetime = html_add_task.getElementsByClassName("todo-task-datetime")[0];
	
			let task_name = html_task_name_input.value;
			let task_date = html_task_datetime.value;

			if (task_name.length < 3 || 255 < task_name.length)
			{
				alert("Task name must be at least 3 letters long and at most 255 letters long");
				return;
			}
			if (task_date === "")
			{
				alert("No task date provided");
				return;
			}

			this.add_task(task_name, task_date);
			html_task_name_input.value = "";
			html_task_datetime.value = "";
		});

		let html_search_input = document.getElementById(this.search_bar_id).getElementsByTagName("input")[0];
		html_search_input.addEventListener("input", (event) => {
			this.search_term = event.target.value;
			this.update_html();
		});
	}

	storage_save()
	{
		localStorage.setItem(this.storage_name, JSON.stringify(this.tasks));
	}

	storage_load()
	{
		let storage_data = localStorage.getItem(this.storage_name);
		this.tasks = storage_data ? JSON.parse(storage_data) : [];
	}

	add_task(name, datetime)
	{
		this.tasks.push({name: name, datetime: datetime});
		this.storage_save();

		this.update_html();
	}

	remove_task(index)
	{
		this.tasks.splice(index, 1);
		this.storage_save();

		this.update_html();
	}

	update_task(index, name, datetime)
	{
		if (name != null)
		{
			this.tasks[index].name = name
		}

		if (datetime != null)
		{
			this.tasks[index].datetime = datetime
		}

		this.storage_save();

		this.update_html();
	}

	update_html()
	{
		let html_todo_list = document.getElementById(this.list_id);
		html_todo_list.replaceChildren();

		for (const [index, task] of this.tasks.entries())
		{
			let match_index = task.name.indexOf(this.search_term);
			if (this.search_term.length >= 2 )
			{
				if (match_index === -1)
				{
					continue;
				}
			}

			let html_task = document.createElement("div");
			html_task.className = "todo-task";
			html_task.id = this.list_id + "-item-" + index.toString();

			let  html_task_name = document.createElement("span");
			html_task_name.className = "todo-task-name";

			if (match_index === -1)
			{
				html_task_name.textContent = task.name
			}
			else
			{
				let before_match = task.name.slice(0, match_index);
				let match = task.name.slice(match_index, match_index + this.search_term.length);
				let after_match = task.name.slice(match_index + this.search_term.length);
				html_task_name.innerHTML = `${before_match}<span class="search-highlight">${match}</span>${after_match}`
			}

			
			html_task_name.addEventListener("click", (event) => {
				html_task_name.contentEditable = "true";
				html_task_name.focus();
			});

			html_task_name.addEventListener("blur", (event) => {
				html_task_name.contentEditable = "false";

				let new_task_name = html_task_name.textContent;
				if (new_task_name.length < 3 || 255 < new_task_name.length)
				{
					alert("Task name must be at least 3 letters long and at most 255 letters long");
					html_task_name.textContent = this.tasks[index].name;
					return;
				}

				this.update_task(index, new_task_name, null);
			});
			html_task.appendChild(html_task_name);

			let html_task_datetime = document.createElement("input");
			html_task_datetime.className = "todo-task-datetime";
			html_task_datetime.type = "datetime-local"
			html_task_datetime.value = task.datetime;
			html_task_datetime.addEventListener("change", (event) => {
				let html_task = event.target.closest(".todo-task");
				let split_id = html_task.id.split("-");
				let task_index = Number(split_id[split_id.length - 1]);
	
				if (event.target.className === "todo-task-datetime")
				{
					this.update_task(task_index, null, event.target.value);
				}
			});
			html_task.appendChild(html_task_datetime);
			
			let html_task_delete_button = document.createElement("button");
			html_task_delete_button.className = "todo-task-delete-button";
			html_task_delete_button.textContent = "Delete";
			html_task_delete_button.addEventListener("click", (event) => {
				let html_task = event.target.closest(".todo-task");
				let split_id = html_task.id.split("-");
				let task_index = Number(split_id[split_id.length - 1]);
	
				if (event.target.className === "todo-task-delete-button")
				{
					this.remove_task(task_index);
				}
			});
			html_task.appendChild(html_task_delete_button);

			html_todo_list.appendChild(html_task);
		}

		if (html_todo_list.children.length === 0)
		{
			let html_no_matches = document.createElement("span");
			html_no_matches.className = "todo-no-matches"
			html_no_matches.textContent = "No tasks match the search criteria";
			html_todo_list.appendChild(html_no_matches);
		}
	}
}

let todo = new todo_widget("my-todo");