// credits go to John Resig (MIT Licensed)
/*
This is a method binder that help add methods to each function / class
By using this function, overloading a method becomes easy
No need to touch it.
*/
function addMethod(object, name, fn){
    var old = object[ name ];
    if ( old )
        object[ name ] = function(){
            if ( fn.length == arguments.length )
                return fn.apply( this, arguments );
            else if ( typeof old == 'function' )
                return old.apply( this, arguments );
        };
    else
        object[ name ] = fn;
}