# GMS API Documentation

## Base URL
Based on your settings, the API base URL should be:
- **Development/Production**: `http://195.250.24.233:7070` (or your server URL)
- **CORS**: Enabled for all origins (`CORS_ALLOW_ALL_ORIGINS = True`)

---

## Authentication

Most APIs use **JWT Token** authentication. The token is obtained after OTP verification.

### Headers for Authenticated Requests:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

## API Endpoints

### 1. Authentication & Login

#### 1.1 Send SMS OTP
**Endpoint**: `POST /api/send-sms/`  
**Authentication**: Not required

**Request Body**:
```json
{
  "businessid": 3,
  "mobile": "98xxxxxxxx"
}
```

**Response**:
```json
{
  "status": true,
  "message": "OTP sent successfully"
}
```

---

#### 1.2 Verify OTP
**Endpoint**: `POST /api/verify-otp/`  
**Authentication**: Not required

**Request Body**:
```json
{
  "businessid": 3,
  "mobile": "98xxxxxxxx",
  "otp": "1234",
  "email": "user@example.com" // optional
}
```

**Response**:
```json
{
  "status": true,
  "message": "Login successful",
  "data": {
    "subscriber_id": 1,
    "business_id": 3,
    "mobile": "98xxxxxxxx",
    "is_new": false,
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

---

### 2. Location APIs

#### 2.1 Get Active Cities
**Endpoint**: `GET /api/active-cities/`  
**Authentication**: Not required

**Response**:
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Pune",
      "service_categories": [...]
    }
  ]
}
```

---

### 3. Garage APIs

#### 3.1 List Garages
**Endpoint**: `POST /api/listgarage/`  
**Authentication**: Not required

**Request Body**:
```json
{
  "location": "pune",
  "latitude": 17.74162000,
  "longitude": 73.8567,
  "filter": {
    "sort": [1, 2],        // 1=highest rating, 2=nearest
    "rating": [1, 2],      // 1=4.5+, 2=4.0+, 3=3.5+, 4=3.0+
    "distance": [1],       // 1=1km, 2=3km, 3=5km
    "service": [1, 2, 3]   // service category IDs
  }
}
```

**Response**:
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Garage Name",
      "address": "...",
      "latitude": 17.7416,
      "longitude": 73.8567,
      "distance": 2.5,
      "rating": 4.5,
      ...
    }
  ]
}
```

---

#### 3.2 Get Garage Details
**Endpoint**: `GET /api/garage/?id={garage_id}`  
**Authentication**: Not required

**Query Parameters**:
- `id` (required): Garage ID

**Response**:
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Garage Name",
    "address": "...",
    "phone": "...",
    "email": "...",
    "latitude": 17.7416,
    "longitude": 73.8567,
    "rating": 4.5,
    "banners": [...],
    "service_provided": [...],
    ...
  }
}
```

---

#### 3.3 Get Garage Services
**Endpoint**: `POST /api/garage/services/`  
**Authentication**: Not required

**Request Body**:
```json
{
  "garageid": 1,
  "ccid": 8  // CC (Cubic Capacity) ID
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Garage services retrieved successfully",
  "data": [
    {
      "id": 1,
      "service_type": "Basic Service",
      "name": "Oil Change",
      "description": "...",
      "price": 500
    }
  ]
}
```

---

### 4. Vehicle & Brand APIs

#### 4.1 Get Brands
**Endpoint**: `GET /api/brands/`  
**Authentication**: Not required

**Response**:
```json
{
  "success": true,
  "message": "Brands retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Honda",
      "image": "http://baseurl/path/to/image.png"
    }
  ]
}
```

---

#### 4.2 Get Models
**Endpoint**: `POST /api/models/`  
**Authentication**: Not required

**Request Body**:
```json
{
  "brand_id": 1  // optional, filter by brand
}
```

**Response**:
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Activa",
      "brand": 1,
      "image": "http://baseurl/path/to/image.png"
    }
  ]
}
```

---

#### 4.3 Get Accessories
**Endpoint**: `GET /api/accessories/`  
**Authentication**: Not required

**Response**:
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Helmet",
      "image": "http://baseurl/path/to/image.png"
    }
  ]
}
```

---

### 5. Subscriber (Customer) APIs

#### 5.1 Get Subscriber Profile
**Endpoint**: `GET /api/subscriber/profile/?subscriber_id={id}`  
**Authentication**: Required (JWT Token)

**Query Parameters**:
- `subscriber_id` (required): Subscriber ID

**Response**:
```json
{
  "status": true,
  "message": "Subscriber details retrieved successfully",
  "data": {
    "id": 1,
    "business_id": 3,
    "phone": "98xxxxxxxx",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

#### 5.2 Update Subscriber Profile
**Endpoint**: `PATCH /api/subscriber/profile/`  
**Authentication**: Required (JWT Token)

**Request Body**:
```json
{
  "subscriber_id": 1,
  "name": "Updated Name",     // optional
  "email": "updated@example.com"  // optional
}
```

**Response**:
```json
{
  "status": true,
  "message": "Profile updated successfully",
  "data": {...}
}
```

---

### 6. Vehicle Management APIs

#### 6.1 Create Vehicle
**Endpoint**: `POST /api/subscriber/vehicle/`  
**Authentication**: Required (JWT Token)

**Request Body**:
```json
{
  "subscriber_id": 1,
  "business_id": 3,
  "brand_id": 1,
  "model_id": 1,
  "vehicle_number": "MH12AB1234",
  "cc_id": 8,
  "fuel_type": "petrol",
  "year": 2020
}
```

---

#### 6.2 Get Vehicle Details
**Endpoint**: `GET /api/subscriber/vehicle/{id}/`  
**Authentication**: Required (JWT Token)

**Response**:
```json
{
  "status": true,
  "data": {
    "id": 1,
    "subscriber_id": 1,
    "brand": {...},
    "model": {...},
    "vehicle_number": "MH12AB1234",
    ...
  }
}
```

---

#### 6.3 Update Vehicle
**Endpoint**: `PUT /api/subscriber/vehicle/{id}/`  
**Authentication**: Required (JWT Token)

---

#### 6.4 Delete Vehicle
**Endpoint**: `DELETE /api/subscriber/vehicle/{id}/`  
**Authentication**: Required (JWT Token)

---

#### 6.5 List All Vehicles
**Endpoint**: `GET /api/subscriber/vehicles/?subscriber_id={id}`  
**Authentication**: Required (JWT Token)

**Query Parameters**:
- `subscriber_id` (required): Subscriber ID

---

### 7. Address Management APIs

#### 7.1 Create Address
**Endpoint**: `POST /api/subscriber/address/`  
**Authentication**: Required (JWT Token)

**Request Body**:
```json
{
  "subscriber_id": 1,
  "business_id": 3,
  "address_line1": "123 Main St",
  "address_line2": "Apt 4B",
  "city": "Pune",
  "state": "Maharashtra",
  "pincode": "411001",
  "latitude": 17.7416,
  "longitude": 73.8567,
  "is_default": true
}
```

---

#### 7.2 Get Address Details
**Endpoint**: `GET /api/subscriber/address/{id}/`  
**Authentication**: Required (JWT Token)

---

#### 7.3 Update Address
**Endpoint**: `PUT /api/subscriber/address/{id}/`  
**Authentication**: Required (JWT Token)

---

#### 7.4 Delete Address
**Endpoint**: `DELETE /api/subscriber/address/{id}/`  
**Authentication**: Required (JWT Token)

---

#### 7.5 List All Addresses
**Endpoint**: `GET /api/subscriber/addresses/?subscriber_id={id}`  
**Authentication**: Required (JWT Token)

---

### 8. Booking APIs

#### 8.1 Create Booking
**Endpoint**: `POST /api/subscriber/booking/`  
**Authentication**: Required (JWT Token)

**Request Body**:
```json
{
  "business_id": 3,
  "subscriber_id": 1,
  "subscribervehicle_id": 1,
  "subscriberaddress_id": 1,
  "garage_id": 1,
  "booking_date": "2024-01-15",
  "booking_slot": "10:00-12:00",
  "suggestion": "Need oil change",
  "booking_amount": 500,
  "promo_code": "DISCOUNT10",  // optional
  "required_estimate": false
}
```

**Response**:
```json
{
  "status": true,
  "message": "Booking created successfully",
  "data": {
    "id": 1,
    "booking_date": "2024-01-15",
    "current_status": {
      "status": "booking_confirmed",
      "displayname": "Booking Confirmed",
      "created_at": "2024-01-10T10:00:00Z"
    },
    "timeline": [...]
  }
}
```

---

#### 8.2 Get Booking Details
**Endpoint**: `GET /api/subscriber/booking/{id}/`  
**Authentication**: Required (JWT Token)

---

#### 8.3 Update Booking
**Endpoint**: `PUT /api/subscriber/booking/{id}/`  
**Authentication**: Required (JWT Token)

---

#### 8.4 Delete Booking
**Endpoint**: `DELETE /api/subscriber/booking/{id}/`  
**Authentication**: Required (JWT Token)

---

#### 8.5 Update Booking Status
**Endpoint**: `POST /api/subscriber/booking/update_status/`  
**Authentication**: Required (JWT Token)

**Request Body**:
```json
{
  "booking_id": 1,
  "status": "booking_confirmed",
  "remark": "Booking confirmed by garage"
}
```

---

### 9. Booking Review API

#### 9.1 Submit Booking Review
**Endpoint**: `POST /api/subscriber/booking-review/`  
**Authentication**: Required (JWT Token)

**Request Body**:
```json
{
  "subscriber_id": 1,
  "booking_id": 1,
  "rating": 5,
  "review": "Great service!"
}
```

**Response**:
```json
{
  "status": true,
  "message": "Review submitted successfully",
  "data": {...}
}
```

---

## Error Responses

All APIs return errors in this format:

```json
{
  "status": false,
  "message": "Error description",
  "error": "Detailed error message"  // optional
}
```

**Common HTTP Status Codes**:
- `200 OK`: Success
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## Integration Example (JavaScript/Fetch)

```javascript
// Base URL
const API_BASE_URL = 'http://195.250.24.233:7070';

// 1. Send OTP
async function sendOTP(mobile, businessId = 3) {
  const response = await fetch(`${API_BASE_URL}/api/send-sms/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      businessid: businessId,
      mobile: mobile
    })
  });
  return await response.json();
}

// 2. Verify OTP and get token
async function verifyOTP(mobile, otp, businessId = 3) {
  const response = await fetch(`${API_BASE_URL}/api/verify-otp/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      businessid: businessId,
      mobile: mobile,
      otp: otp
    })
  });
  const data = await response.json();
  if (data.status && data.data.token) {
    localStorage.setItem('auth_token', data.data.token);
    localStorage.setItem('subscriber_id', data.data.subscriber_id);
  }
  return data;
}

// 3. Get Garages (with authentication if needed)
async function getGarages(location, latitude, longitude, filters = {}) {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE_URL}/api/listgarage/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify({
      location: location,
      latitude: latitude,
      longitude: longitude,
      filter: filters
    })
  });
  return await response.json();
}

// 4. Create Booking (requires authentication)
async function createBooking(bookingData) {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE_URL}/api/subscriber/booking/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(bookingData)
  });
  return await response.json();
}

// 5. Get Garage Details
async function getGarageDetails(garageId) {
  const response = await fetch(`${API_BASE_URL}/api/garage/?id=${garageId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  return await response.json();
}
```

---

## Notes

1. **Business ID**: Default business ID is `3` (as seen in settings.py: `BUSINESS_ID = 3`)

2. **CORS**: CORS is enabled for all origins, so you can call these APIs from any frontend domain

3. **Authentication**: Store the JWT token from OTP verification and include it in the `Authorization` header for protected endpoints

4. **Image URLs**: Image URLs in responses are relative paths. You may need to prepend the base URL to display them

5. **Date Format**: Use ISO 8601 format for dates (e.g., "2024-01-15")

6. **Error Handling**: Always check the `status` field in responses before processing data

---

## Testing the APIs

You can test these APIs using:
- **Postman**: Import the endpoints and test with sample data
- **curl**: Command-line tool
- **Browser DevTools**: For GET requests
- **Your Frontend**: Direct integration with fetch/axios

---

For more details on specific endpoints, refer to the source files in:
- `GMSApp/modules/api/customerUI/`

