var file_system={
    dir:function(base){
	var self= this;
	this={
	    ls:{".":self,"..":base},
	    set:function(name,val){
		self.ls[name]= val;
	    },
	    get:function(name){
		return self.ls[name];
	    },
	    rm:function(name){
		self.ls[name]= null;
	    },
	    mkdir:function(name){
		if(!self.ls[name]){
		    self.ls[name]= new file_system.dir(self);
		}
	    },
	    rmdir:function(name){
		if(self.ls[name]){
		    self.ls[name]= null;
		}
	    },
	    open:function(name){
		
	    }
	};
    },
    file:function(_data){
	var self= this;
	this={
	    data:_data,
	    copy:function(){
		return new file_system.file(this.data);
	    }
	};
    },
};

