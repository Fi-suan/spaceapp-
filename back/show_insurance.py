import json

with open('insurance_response.json', 'r') as f:
    d = json.load(f)

print('=== CLIMATE RISKS ===')
for r in d.get('climate_risks', []):
    print(f"- {r['type']}: {r['count']} (Severity: {r['severity']})")

print('\n=== VERIFIED CLAIMS ===')
for c in d.get('verified_claims', []):
    print(f"\nClaim: {c['claim_id']} - {c['type']}")
    print(f"Location: {c['location']}")
    print(f"Status: {c['status']}")
    print("Evidence:")
    for e in c.get('evidence', []):
        print(f"  - {e}")
    print(f"Fraud: {c['fraud_probability']}")
