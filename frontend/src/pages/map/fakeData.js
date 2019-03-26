const TOTAL_COUNT = 1000;

export const kiev = { lat: 50.4475854, lng: 30.519837 };

export const fakeData = [...Array(TOTAL_COUNT)]
  .fill(0)
  .map((__, index) => ({
    id: index,
    lat:
      kiev.lat + (Math.random() * 2 - 1) / 5,
    lng:
      kiev.lng + (Math.random() * 2 - 1) / 5,
    sport_type_id:
    Math.round(Math.random() * 5),
  }));
