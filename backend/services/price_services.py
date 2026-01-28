from typing import List, Dict

async def search_medicine_prices(medicine_name: str) -> List[Dict]:
    """
    Simulates searching for medicine prices across different vendors.
    In a real app, this would scrape 1mg, Apollo, Pharmeasy, etc., or use their APIs.
    """
    
    # Mock Data Generator
    import random
    
    base_price = sum(ord(c) for c in medicine_name) % 500 + 50 # Random base price based on name
    
    vendors = [
        {"name": "Apollo Pharmacy", "logo": "apollo", "reliability": "High"},
        {"name": "1mg", "logo": "1mg", "reliability": "High"},
        {"name": "Pharmeasy", "logo": "pharmeasy", "reliability": "Medium"},
        {"name": "Netmeds", "logo": "netmeds", "reliability": "Medium"},
    ]
    
    results = []
    
    for vendor in vendors:
        # Variance in price
        variance = random.uniform(0.85, 1.15)
        price = round(base_price * variance, 2)
        rating = round(random.uniform(3.5, 5.0), 1)
        
        results.append({
            "vendor_name": vendor["name"],
            "price": price,
            "currency": "INR",
            "rating": rating,
            "delivery_time": f"{random.randint(24, 72)} hours",
            "link": f"https://www.{vendor['name'].replace(' ', '').lower()}.com/search?q={medicine_name}"
        })
        
    # Sort by price
    results.sort(key=lambda x: x['price'])
    
    # Tag best price
    if results:
        results[0]['is_best_price'] = True
        
    return results
