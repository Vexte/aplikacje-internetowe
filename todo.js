class todo_list 
{
    constructor()
    {
        this.tasks = []
        this.storage_name = "todo-tasks-data";
    }

    save()
    {
        localStorage.setItem(this.storage_name, JSON.stringify(tasks));
    }
}