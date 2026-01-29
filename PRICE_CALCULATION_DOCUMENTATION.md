# 📊 Shipment Price Calculation Documentation

## Overview
This document explains the comprehensive price calculation system used in the CargoConnect logistics platform. The system calculates shipping costs based on multiple factors including weight, number of pieces, distance, and cargo type.

## 🧮 Price Calculation Formula

### Base Formula
```
Final Price = (Weight Price + Pieces Price) × Distance Multiplier × Cargo Type Multiplier
```

### Detailed Breakdown

#### 1. Weight Price
```
Weight Price = Weight (kg) × Q2.50
```
- **Rate**: Q2.50 per kilogram
- **Purpose**: Covers basic transportation cost based on cargo weight

#### 2. Pieces Price
```
Pieces Price = Number of Pieces × Q5.00
```
- **Rate**: Q5.00 per piece
- **Purpose**: Covers handling and processing cost per individual item
- **Default**: 1 piece if not specified

#### 3. Base Price
```
Base Price = Weight Price + Pieces Price
```

#### 4. Distance Multiplier
```
Distance Multiplier = max(1, Real Distance (km) ÷ 50)
```
- **Minimum**: 1.0x (for distances ≤ 50km)
- **Purpose**: Increases price for longer distances
- **Calculation**: Uses Haversine formula for accurate distance

#### 5. Cargo Type Multiplier
```
Cargo Type Multiplier = {
  'general': 1.0x,
  'perishable': 1.2x,
  'fragile': 1.3x,
  'hazardous': 1.5x
}
```
- **Purpose**: Adjusts price based on special handling requirements

#### 6. Final Price
```
Final Price = round(Base Price × Distance Multiplier × Cargo Type Multiplier)
```

## 🌍 Distance Calculation

### Haversine Formula
The system uses the Haversine formula to calculate the real distance between pickup and delivery coordinates:

```javascript
const R = 6371; // Earth's radius in km
const dLat = (deliveryLat - pickupLat) * Math.PI / 180;
const dLng = (deliveryLng - pickupLng) * Math.PI / 180;
const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(pickupLat * Math.PI / 180) * Math.cos(deliveryLat * Math.PI / 180) *
          Math.sin(dLng/2) * Math.sin(dLng/2);
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
const distance = R * c;
```

## 📋 Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `weight` | Number | Yes | Weight in kilograms |
| `pieces` | Number | No | Number of pieces (default: 1) |
| `pickupCoordinates` | Object | Yes | {lat, lng} pickup location |
| `deliveryCoordinates` | Object | Yes | {lat, lng} delivery location |
| `cargoType` | String | Yes | 'general', 'perishable', 'fragile', 'hazardous' |

## 💰 Calculation Examples

### Example 1: Local General Cargo
```
Input:
- Weight: 50 kg
- Pieces: 2
- Distance: 25 km
- Cargo Type: general

Calculation:
- Weight Price: 50 × Q2.50 = Q125
- Pieces Price: 2 × Q5.00 = Q10
- Base Price: Q125 + Q10 = Q135
- Distance Multiplier: max(1, 25 ÷ 50) = 1.0x
- Cargo Type Multiplier: 1.0x
- Final Price: Q135 × 1.0 × 1.0 = Q135
```

### Example 2: Long Distance Fragile Cargo
```
Input:
- Weight: 100 kg
- Pieces: 5
- Distance: 200 km
- Cargo Type: fragile

Calculation:
- Weight Price: 100 × Q2.50 = Q250
- Pieces Price: 5 × Q5.00 = Q25
- Base Price: Q250 + Q25 = Q275
- Distance Multiplier: max(1, 200 ÷ 50) = 4.0x
- Cargo Type Multiplier: 1.3x
- Final Price: Q275 × 4.0 × 1.3 = Q1,430
```

### Example 3: Hazardous Materials
```
Input:
- Weight: 75 kg
- Pieces: 3
- Distance: 150 km
- Cargo Type: hazardous

Calculation:
- Weight Price: 75 × Q2.50 = Q187.50
- Pieces Price: 3 × Q5.00 = Q15
- Base Price: Q187.50 + Q15 = Q202.50
- Distance Multiplier: max(1, 150 ÷ 50) = 3.0x
- Cargo Type Multiplier: 1.5x
- Final Price: Q202.50 × 3.0 × 1.5 = Q911.25 → Q911
```

## 🔄 Real-Time Updates

The price calculation automatically updates when any of these factors change:
- **Coordinates**: Moving pickup or delivery location
- **Weight**: Changing cargo weight
- **Pieces**: Modifying number of pieces
- **Cargo Type**: Switching between general, perishable, fragile, or hazardous

## 🎯 Business Logic

### Pricing Strategy
1. **Base Cost**: Weight and pieces provide the foundation
2. **Distance Factor**: Longer distances increase costs exponentially
3. **Risk Factor**: Special cargo types require additional handling
4. **Minimum Pricing**: Ensures profitability for short distances

### Market Considerations
- **Weight Rate (Q2.50/kg)**: Competitive with local logistics rates
- **Pieces Rate (Q5.00/piece)**: Covers handling and processing costs
- **Distance Factor**: Reflects fuel and time costs for longer routes
- **Cargo Multipliers**: Account for insurance and special handling requirements

## 🔧 Technical Implementation

### Auto-Calculation Trigger
```javascript
useEffect(() => {
  if (formData.pickupCoordinates && formData.deliveryCoordinates && 
      formData.weight && estimatedPrice !== null) {
    // Recalculate price automatically
  }
}, [formData.pickupCoordinates, formData.deliveryCoordinates, 
    formData.weight, formData.pieces, formData.cargoType]);
```

### Manual Calculation
Users can manually trigger price calculation using the "Calcular Precio" button, which:
1. Validates required fields
2. Calculates real distance using coordinates
3. Applies all multipliers
4. Updates the estimated price display

## 📈 Future Enhancements

### Potential Improvements
1. **Fuel Price Integration**: Dynamic distance rates based on current fuel prices
2. **Regional Pricing**: Different rates for different regions in Guatemala
3. **Time-Based Pricing**: Rush delivery surcharges
4. **Volume Discounts**: Reduced rates for high-volume shipments
5. **Seasonal Adjustments**: Holiday or weather-based pricing

### API Integration
- **Google Maps API**: More accurate distance calculations
- **Real-Time Traffic**: Route optimization and time estimates
- **Fuel Price APIs**: Dynamic fuel cost adjustments

## 🎯 Summary

The CargoConnect price calculation system provides:
- ✅ **Transparent pricing** based on clear factors
- ✅ **Real-time updates** as users modify shipment details
- ✅ **Accurate distance calculation** using geographic coordinates
- ✅ **Fair pricing** that accounts for weight, handling, distance, and risk
- ✅ **Competitive rates** suitable for the Guatemalan market

This comprehensive approach ensures both clients and transporters receive fair, transparent pricing that reflects the true cost of logistics services.
