var db;
init();

// Open this page's local database.
function init() {
  var success = false;

  if (window.google && google.gears) {
    try {
      db = google.gears.factory.create('beta.database', '1.0');

      if (db) {
        db.open('database-demo');
        db.execute('create table if not exists Store' +
                   ' (Data varchar(255), Timestamp int)');

        success = true;
        // Initialize the UI at startup.
        Load();
      }

    } catch (ex) {
      setError('Could not create database: ' + ex.message);
    }
  }

  // Enable or disable UI elements

  var inputs = document.getElementsByTagName('input');
  for (var i = 0, el; el = inputs[i]; i++) {
    el.disabled = !success;
  }

}

function _Save(what) {
  if (!google.gears.factory || !db) {
    return;
  }

  var currTime = new Date().getTime();
  
  _save("Store",what,currTime);
}

function _save(table){
  if (!google.gears.factory || !db) {
    return;
  }
  var query = 'insert into '+table+' values (';
  var items = [];
  for (var i=1;i<arguments.length;i++){
      items.push(arguments[i]);
      query+='?, ';
  }
  query = query.slice(0,-2)+')'
  console.log(query);
  db.execute(query, items);
}

function _load(){
  var recent = ['', '', ''];

  // We re-throw Gears exceptions to make them play nice with certain tools.
  // This will be unnecessary in a future version of Gears.
  try {

    // Get the 3 most recent entries. Delete any others.
    var rs = db.execute('select * from Store order by Timestamp desc');
    var index = 0;
    while (rs.isValidRow()) {
      if (index < 3) {
        recent[index] = rs.field(0);
      } else {
        db.execute('delete from Store where Timestamp=?', [rs.field(1)]);
      }
      ++index;
      rs.next();
    }
    rs.close();

  } catch (e) {
    throw new Error(e.message);
  }
  return recent;
}

function _Load() {

  var status = document.getElementById('status');
  status.innerHTML = _load()[0];
}