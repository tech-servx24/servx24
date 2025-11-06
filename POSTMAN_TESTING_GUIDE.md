# Postman Testing Guide for Service Category IDs

This guide will help you test different service category IDs to find which one corresponds to "Ev Service" and which garages are linked to it.

## Prerequisites

1. **Postman** installed
2. **API Base URL**: `https://workshop.bikedoot.com/api` (or your server URL)
3. **Coordinates for Pune**: 
   - Latitude: `18.5204`
   - Longitude: `73.8567`

---

## Step 1: Get All Service Categories (Find Available IDs)

First, let's see what service categories are available and their IDs.

### Request Setup:
- **Method**: `GET`
- **URL**: `https://workshop.bikedoot.com/api/active-cities/?city=pune`
- **Headers**: 
  ```
  Content-Type: application/json
  ```

### Response:
This will return all service categories for Pune. Look for the `data.filter.services` array:

```json
{
  "status": "success",
  "message": "Active cities, banners and services for pune retrieved successfully",
  "data": {
    "filter": {
      "services": [
        {
          "id": 1,
          "name": "Bike Service at Garage",
          "image": "..."
        },
        {
          "id": 2,
          "name": "Pick & Drop Bike Service",
          "image": "..."
        },
        {
          "id": 7,
          "name": "Ev Service ",
          "image": null
        }
      ]
    }
  }
}
```

**Note**: The service category ID is in the `id` field. If "Ev Service" has Display="Hidden" in admin, it won't appear here.

---

## Step 2: Test List Garages API with Different Service Category IDs

Now let's test the `/api/listgarage/` endpoint with different service category IDs.

### Request Setup:
- **Method**: `POST`
- **URL**: `https://workshop.bikedoot.com/api/listgarage/`
- **Headers**: 
  ```
  Content-Type: application/json
  ```

---

## Test Cases

### Test 1: Get ALL Garages (No Service Filter)

**Purpose**: See how many garages exist in Pune without any service filter.

**Request Body**:
```json
{
  "location": "Pune",
  "latitude": 18.5204,
  "longitude": 73.8567,
  "filter": {
    "sort": [],
    "ratings": [],
    "distence": [],
    "service": []
  }
}
```

**Expected Response**:
```json
{
  "status": "success",
  "message": "Garages in Pune retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Garage Name",
      "city": "Pune",
      ...
    }
  ]
}
```

**What to check**: 
- Count of garages returned
- Note the garage IDs

---

### Test 2: Test Service Category ID 6

**Purpose**: Test if ID 6 is linked to EV Service garages.

**Request Body**:
```json
{
  "location": "Pune",
  "latitude": 18.5204,
  "longitude": 73.8567,
  "filter": {
    "sort": [],
    "ratings": [],
    "distence": [],
    "service": [6]
  }
}
```

**What to check**:
- How many garages returned?
- Do the garage names match EV service garages?
- Check the `data` array length

---

### Test 3: Test Service Category ID 7

**Purpose**: Test if ID 7 is linked to EV Service garages (this was found in the API response).

**Request Body**:
```json
{
  "location": "Pune",
  "latitude": 18.5204,
  "longitude": 73.8567,
  "filter": {
    "sort": [],
    "ratings": [],
    "distence": [],
    "service": [7]
  }
}
```

**What to check**:
- How many garages returned?
- Compare with Test 2 results

---

### Test 4: Test Multiple Service Category IDs

**Purpose**: Test multiple IDs at once to see which one returns garages.

**Request Body**:
```json
{
  "location": "Pune",
  "latitude": 18.5204,
  "longitude": 73.8567,
  "filter": {
    "sort": [],
    "ratings": [],
    "distence": [],
    "service": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  }
}
```

**What to check**:
- This will return garages that have ANY of these service categories
- Compare with individual tests

---

## Quick Reference: Service Category IDs from Database Backup

Based on the database backup, these are the known service category IDs:

| ID | Service Category Name |
|----|----------------------|
| 1  | Bike Service at Garage |
| 2  | Pick & Drop Bike Service |
| 3  | Bike Service at Doorstep |
| 4  | Nearby Petrol Pump |
| 5  | Roadside Assistant (RSA) |
| 6  | *(Unknown - needs testing)* |
| 7  | Ev Service (found in API response) |

---

## How to Interpret Results

### ✅ Success Case:
```json
{
  "status": "success",
  "message": "Garages in Pune retrieved successfully",
  "data": [
    {
      "id": 10,
      "name": "EV Garage Example",
      "city": "Pune",
      ...
    }
  ]
}
```
**Meaning**: Service category ID is correct and garages are linked to it.

### ⚠️ Empty Result Case:
```json
{
  "status": "success",
  "message": "Garages in Pune retrieved successfully",
  "data": []
}
```
**Meaning**: 
- Service category ID might be wrong, OR
- No garages in Pune are linked to this service category, OR
- Garages exist but are not in Pune city, OR
- Garages are not marked as `displayed=True`

---

## Troubleshooting Steps

1. **If all service IDs return empty arrays**:
   - Check if garages in admin panel have `displayed=True`
   - Check if garages are in "Pune" city
   - Verify `RelGarageServiceCategory` records exist in database

2. **If you get garages but not the right ones**:
   - Check the garage names against admin panel
   - Verify which service categories are actually linked to those garages

3. **To find the correct ID**:
   - Go to admin panel → Service Categories
   - Find "Ev Service" row
   - Note the ID column (or check the URL when editing: `/u-accounts-servicecategory/{ID}/`)
   - Use that ID in Postman

---

## Postman Collection Setup

You can create a Postman Collection with these requests:

1. **Collection Name**: "GMS API - Service Category Testing"
2. **Environment Variables**:
   - `base_url`: `https://workshop.bikedoot.com/api`
   - `city`: `Pune`
   - `latitude`: `18.5204`
   - `longitude`: `73.8567`

3. **Request Templates**:
   - Use variables: `{{base_url}}/listgarage/`
   - Use variables in body: `"location": "{{city}}"`

---

## Example: Testing ID 6 vs ID 7

### Test ID 6:
```json
POST https://workshop.bikedoot.com/api/listgarage/
{
  "location": "Pune",
  "latitude": 18.5204,
  "longitude": 73.8567,
  "filter": {
    "sort": [],
    "ratings": [],
    "distence": [],
    "service": [6]
  }
}
```

### Test ID 7:
```json
POST https://workshop.bikedoot.com/api/listgarage/
{
  "location": "Pune",
  "latitude": 18.5204,
  "longitude": 73.8567,
  "filter": {
    "sort": [],
    "ratings": [],
    "distence": [],
    "service": [7]
  }
}
```

**Compare the results**:
- Which one returns garages?
- How many garages in each?
- Are the garage names the same?

---

## Next Steps After Testing

Once you find the correct service category ID:

1. **Update the frontend code**: 
   - Update `FALLBACK_EV_SERVICE_ID` constant in `EVService.jsx`
   - Or verify the API auto-detection is working

2. **Verify in Admin Panel**:
   - Check that garages have `RelGarageServiceCategory` records
   - Verify garages are in correct city
   - Verify `displayed=True` for garages

---

## Additional Tips

1. **Save responses**: Save each test response in Postman to compare later
2. **Use Postman Tests**: Add tests to automatically check if response contains garages
3. **Export Collection**: Export your collection to share with team
4. **Document Results**: Note which IDs work and which don't

---

## Common Issues

### Issue: "City not found" error
**Solution**: Make sure city name matches exactly (case-insensitive, but spelling must match)

### Issue: Empty response but garages exist in admin
**Solution**: Check `RelGarageServiceCategory` table - the relationship might not exist

### Issue: Different garages than expected
**Solution**: The service category ID might be linked to a different service. Check admin panel relationships.

