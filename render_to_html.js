var render_to_html={
    render:function(fi){
	if(fi==null || fi.is_dir==null) return "nil";
	//use './.render_to_html' as function to render '.' or render as string
	if(fi.is_dir()){
	    var render_bloc= fi.ref('.render_to_html');
	    if(render_bloc){
		return render_bloc.data(fi);
	    }else{
		return mr("",fi.ls(),mr_concat,function(v,k){
		    return render_to_html.render(fi.get(v));
		});
	    }
	}else{
	    return escapeHtml(fi.data.toString());
	}
    },
    start_up:function(){
	event.register('render_to_html',render_to_html.render);
    },
};
render_to_html.start_up();
