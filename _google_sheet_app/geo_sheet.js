//расчет расстояния по прямой межлу 2мя координатами с геокодингом адресов

function GeoCodeAndRoutingLine(startAddr,endAddr) {
   var MapObj = Maps.newGeocoder();

 
/*var response = Maps.newGeocoder().geocode(startAddr);
for (var i = 0; i < response.results.length; i++) {
  var result = response.results[i];
  Logger.log('%s: %s, %s', result.formatted_address, result.geometry.location.lat,
      result.geometry.location.lng);
}
 startAddr="астана улы дала 34";
 endAddr ="астана мангилик ел 50"; */

var d =MapObj.geocode(startAddr);
var o = MapObj.geocode(endAddr); 

if (d === null) {
    throw new Error('Address not found!');
    return 0;
  }
 
lon1=d.results[0].geometry.location.lng;
lat1=d.results[0].geometry.location.lat;


if (o === null) {
    throw new Error('Address not found!');
    return 0;
  }
 
lon2=o.results[0].geometry.location.lng;
lat2=o.results[0].geometry.location.lat;
 
 /*x1=51.094533
 y1=71.427267
 x2=51.094675
 y2=71.437158*/
 
dst=getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2)*1000;
//Logger.log( dst) 
return dst;
}
//---------------------------------------------------------
//расчет расстояния по графу дорог с геокодингом адресов
//---------------------------------------------------------
function GeoCodeAndRouting(startAddr,endAddr) {
  var MapObj = Maps.newDirectionFinder();


//startAddr="астана улы дала 34";
//endAddr ="астана мангилик ел 50";

   MapObj.setOrigin(startAddr);
   MapObj.setDestination(endAddr);

var direct = MapObj.getDirections();
 
var getleg =direct["routes"][0]["legs"][0];

var dist=getleg["distance"]["value"];
var duar=getleg["duration"]["value"];
//var start_location=getleg["start_locatio"]["lat"];
//Logger.log(direct);


 return dist;
//Logger.log(dist);
//Logger.log(duar);
}
//---------------------------------------------------------
//расчет в километрах между точками координатами по сфере
//---------------------------------------------------------

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)

}

//------------------------------------------------------
//расчет расстояний по мапабле 
function GETMAPABLEAPIDISTANCE(startAddr,endAddr) {
// Make a Get request 
var header = {
"user-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Mobile Safari/537.36"
};
//setup time at 0.0
  const YOUR_UNIX_TIME = Math.floor(1.696283007E12) ;
  var d= new Date(YOUR_UNIX_TIME  ) ;
  var h  = d.getHours();

key ="pk_ ";
 
// startAddr ="71.444075,51.092446";
//endAddr ="71.427267,51.094533";
 

 //startAddr =" г. Алматы улица Ботанический Сад 7 8";
 //endAddr ="г. Алматы, ул. Жарокова 187/1";

var options = {
  'method' : 'get',
  'headers' : header
};
const stringObj = new String(startAddr);
 
 //need sinc about compare lower and upper string for check cordinat or address input
 if (stringObj.toLowerCase()!=stringObj.toUpperCase())
 {
///---------froms
  let url_from= "https://geocoder.api.mappable.world/v1/?apikey="+key+"&geocode="+startAddr+"&lang=ru_KZ";
   response_from = UrlFetchApp.fetch(url_from,options);
   // Logger.log(response_from ) 
  if (response_from.getResponseCode() != 200) {return -1;}
 
   json_response_from = JSON.parse(response_from);
   if (json_response_from["response"]["GeoObjectCollection"]["metaDataProperty"]["GeocoderResponseMetaData"]["found"]==0) return "Addr startAddr not found";

   status_addrFrom=json_response_from["response"]["GeoObjectCollection"]["featureMember"][0]["GeoObject"]["metaDataProperty"]["GeocoderMetaData"]["precision"];
   if (status_addrFrom!="exact" & status_addrFrom!="number" ) return "Addr startAddr not uniq";
   
  froms=json_response_from["response"]["GeoObjectCollection"]["featureMember"][0]["GeoObject"]["Point"]["pos"];
  
 //  Logger.log(froms); 
/////---------tos
let url_to= "https://geocoder.api.mappable.world/v1/?apikey="+key+"&geocode="+endAddr+"&lang=ru_KZ";
   response_to = UrlFetchApp.fetch(url_to,options);
 //Logger.log(response_to );
  if (response_to.getResponseCode() != 200) {return -1;}
 
   json_response_to = JSON.parse(response_to);
   if (json_response_to["response"]["GeoObjectCollection"]["metaDataProperty"]["GeocoderResponseMetaData"]["found"]==0)return "Addr endAddr not found";
   status_addrTo=json_response_to["response"]["GeoObjectCollection"]["featureMember"][0]["GeoObject"]["metaDataProperty"]["GeocoderMetaData"]["precision"];
   if (status_addrTo!="exact" & status_addrTo!="number" ) return "Addr endAddr not uniq";
  tos=json_response_to["response"]["GeoObjectCollection"]["featureMember"][0]["GeoObject"]["Point"]["pos"];
  //Logger.log(tos); 
 


  }
//if data is coordinate
  else {
       froms=startAddr;
       tos=endAddr;

  }
 ///mapable error 
 sObj = new String(froms);
 if(sObj.indexOf(',')<0){
                          froms=sObj.replace(' ',',');
                          }
//Logger.log(froms );

eObj = new String(tos);
if(eObj.indexOf(',')<0){
                          tos=eObj.replace(' ',',');
                        }

// Logger.log(tos );

 
//let url="https://distancematrix.api.mappable.world/v2/?origins="+froms+"&destinations="+tos+"&departure_time="+YOUR_UNIX_TIME+"&apikey="+key;
let url="https://distancematrix.api.mappable.world/v2/?origins="+froms+"&destinations="+tos+"&apikey="+key;

 // Logger.log(url  );

response = UrlFetchApp.fetch(url,options);
 if (response.getResponseCode() != 200) {return -1;}
//Logger.log(response);
//console.log(response);
json_response = JSON.parse(response);

//Logger.log(json_response["rows"][0]["elements"][0]["distance"]["value"]);

return json_response["rows"][0]["elements"][0]["distance"]["value"];

//Logger.log(json_response);
//var ss = SpreadsheetApp.getActiveSpreadsheet();   //Get reference to active spreadsheet for when setting values in certain sheets;


//var sheet = ss.getSheetByName('Data');
 //sheet.appendRow([json_response] );

 
}

//---------------------------------------------------------------
const MIN = (x, y) => (x < y ? x : y);
const MAX = (x, y) => (x > y ? x : y);
const INSIDE = 0;
const OUTSIDE = 1;

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Boom {
  constructor(id) {
    this.id = id;
  }
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
}
//проверка попадания точки в полигон
function CheckZoneIN(diap,lon,lat)
{
 //diap="b2:c546";
var ss = SpreadsheetApp.getActiveSpreadsheet(); 
var sheet = ss.getSheetByName('PolygonKFC');
  //Get reference to active spreadsheet for when setting values in certain sheets;
 

const pkfc=new Point(lon,lat);
 Logger.log( 'diap=%s, x=%s y=%s',diap,pkfc.x ,pkfc.y);

//Logger.log(diap);
 var data = sheet.getRange(diap).getValues()
 // Logger.log(data[0][0]);
 
 var dl=data.length;
 //Logger.log( 'кол-во строк %s ',dl);
const arr = new Array(dl+2).fill(0).map((a, i) => new Boom(i));
 
for (let j = 0; j < dl; j++) {
      arr[j].x = data[j][0];
      arr[j].y = data[j][1];
      //Logger.log( 'x=%s y=%s',data[j][0] ,data[j][1]);
}

//var rez=InsidePolygon(arr,dl,pkfc);
//Logger.log( ' %s ',rez);
var rez1=isInPoly(arr, pkfc)
//Logger.log( ' %s ',rez1);
return rez1;
 //sheet.appendRow([json_response] );


}
//полигон замкнут
function InsidePolygon(polygon, N, p) {
  let counter = 0;
  let p1, p2;
  p1 = polygon[0];
  Logger.log( ' %s ',N);
 // Logger.log( 'xy=%s, %s ',p.x,p.y);
  for (let i = 1; i <= N; i++) {
    p2 = polygon[i % N];
    // Logger.log( 'p1=%s, p2= %s ',p1,p2);
    if (p.y > MIN(p1.y, p2.y)) {
      if (p.y <= MAX(p1.y, p2.y)) {
        if (p.x <= MAX(p1.x, p2.x)) {
          if (p1.y !== p2.y) {
            const xinters = (p.y - p1.y) * (p2.x - p1.x) / (p2.y - p1.y) + p1.x;
            if (p1.x === p2.x || p.x <= xinters) {
              counter++;
            }
          }
        }
      }
    }
    p1 = p2;
  }
   //Logger.log( 'counter=%s ',counter);
  if (counter % 2 === 0) {
    return OUTSIDE;
  } else {
    return INSIDE;
  }
}

//полигон не замкнуи=т
function isInPoly(polygon,point)
{
	var i=1,N=polygon.length,isIn=false,p1=polygon[0],p2;
	// Logger.log( 'кол-во строк %s ',N);
	for(;i<=N;i++)
	{
		p2 = polygon[i % N];
		if (point.x > MIN(p1.x,p2.x)) 
		{
			if (point.x <= MAX(p1.x,p2.x)) 
			{
				if (point.y <= MAX(p1.y,p2.y)) 
				{
					if (p1.x != p2.x) 
					{
						xinters = (point.x-p1.x)*(p2.y-p1.y)/(p2.x-p1.x)+p1.y;
						if (p1.y == p2.y || point.y <= xinters)
							isIn=!isIn;
					}
				}
			}
		}
  //   Logger.log( 'p1=%s, p2= %s ',p1,p2);
		p1 = p2;
	}
	return isIn;
}



