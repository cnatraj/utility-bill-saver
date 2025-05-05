const homeAssetChecklist = [
  {
    "id": "hvac_unit",
    "label": "HVAC Unit",
    "description": "Your central heating and cooling system is one of the biggest energy users in your home.",
    "tags": ["appliance", "high_impact"],
    "impact": "high"
  },
  {
    "id": "water_heater",
    "label": "Water Heater",
    "description": "Water heating often accounts for 15–20% of your total energy bill.",
    "tags": ["appliance", "high_impact"],
    "impact": "high"
  },
  {
    "id": "windows_and_doors",
    "label": "Windows and Glass Doors",
    "description": "These areas affect insulation and temperature control. 2 or 3 sample photos help us assess efficiency.",
    "tags": ["structure", "insulation"],
    "impact": "medium"
  },
  {
    "id": "refrigerator",
    "label": "Refrigerator",
    "description": "Old or secondary fridges (like in the garage) can waste a lot of energy.",
    "tags": ["appliance", "medium_impact"],
    "impact": "medium"
  },
  {
    "id": "clothes_dryer",
    "label": "Clothes Dryer",
    "description": "Electric dryers consume a lot of energy, especially if used during peak hours.",
    "tags": ["appliance", "medium_impact"],
    "impact": "medium"
  },
  {
    "id": "ev_charger",
    "label": "EV Charger (if you have one)",
    "description": "Charging an electric vehicle at home can significantly impact your energy bill.",
    "tags": ["appliance", "conditional", "high_impact"],
    "impact": "high"
  },
]


export default homeAssetChecklist;