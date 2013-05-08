
function fnil(){}

function show(x,n){
    n= n||3;
    if(n<=0) return "";
    var ret=x+"{";
    for(i in x){
	ret+= i+"=";
	ret+= show(x[i],n-1)+", ";
    }
    ret+="}";

    return ret;         
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
function escapeString(str) {  
    return '"' + str.replace(/(\\|\"|\n|\r|\t)/g, "\\$1") + '"';  
}  
//Object.prototype.
serialize= function(){
    var type = __typeof__(this);
    switch(type){
    case 'Array' :{
        var strArray = '['; 
        for ( var i=0 ; i < this.length ; ++i ){
            var value = ''; 
            if ( this[i] ){
                value = this[i].serialize();
            }
            strArray += value + ',';
        }
        if ( strArray.charAt(strArray.length-1) == ',' ){
            strArray = strArray.substr(0, strArray.length-1);
        }
        strArray += ']';  
        return strArray;
    }
    case 'Date' :{
        return 'new Date(' + this.getTime() + ')';
    }
    case 'String':{
	return escapeString(this);
    }
    case 'Boolean': case 'Function': case 'Number':{
        return this.toString();
    }
    default:{
        var serialize = '{'; 
        for(var key in this){
            if ( key == 'Serialize' ) continue; 
            var subserialize = 'null';
            if ( this[key] != undefined ){
                subserialize = this[key].serialize();
            }
            serialize += '\r\n' + key + ' : ' + subserialize + ',';
        }
        if ( serialize.charAt(serialize.length-1) == ',' ){
            serialize = serialize.substr(0, serialize.length-1);
        }
        serialize += '\r\n}';
        return serialize;
    }
    }
};

function mr_push(r,i){
    r.push(i);
    return r;
}
function mr_concat(r,i){
    return r.concat(i);
}
function mr_mkcond(cond){
    cond= cond||function(val){return true;}
    return function(collect,val){
	if(cond(val)){
	    return collect.push(val);
	}else{
	    return collect;
	}
    };
}
function mr(dst,src,freduce,fmap){
    freduce= freduce||function(collect,val){return collect;};
    fmap= fmap||function(val,key){return val;}
    for(key in src){
	dst= freduce(dst, fmap(src[key],key));
    }
    return dst;
}
