// import geolib from 'geolib';
// import Warehouse from '../models/Warehouse.js';

// async function findNearestWarehouse(lat, lng) {
//   const warehouses = await Warehouse.find({ status: 'active' });

//   const nearest = geolib.findNearest(
//     { latitude: lat, longitude: lng },
//     warehouses.map(w => ({
//       latitude: w.location.coordinates.lat,
//       longitude: w.location.coordinates.lng,
//       warehouseId: w._id
//     }))
//   );

//   return nearest.warehouseId;
// }
