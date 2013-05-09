var event={
    reg_def_event:function(){
	var empty_func_bloc= new file_system.file_bloc(function(x){});
	var event_dir= new file_system.file_dir({
	    'user_input':empty_func_bloc,
	    'user_keypress':empty_func_bloc,
	    'user_keydown':empty_func_bloc,
	    'user_keyup':empty_func_bloc,
	    'render_to_html':empty_func_bloc,
	});
	root.push('event',event_dir);
    },
    register:function(event_name,event_func){
	event_func= event_func||function(x){};
	var event_func_bloc= new file_system.file_bloc(event_func);
	var event_dir= root.get('event');
	event_dir.push(event_name,event_func_bloc);
	root.push('event',event_dir);
    },
    trigger:function(event_name,sender,arg){
	var finput= root.ref('event').ref(event_name).data;
	return finput(sender,arg);
    },
    start_up:function(){
	event.reg_def_event();
    },
};
event.start_up();
