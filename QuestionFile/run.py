import json

truths = [
  "你有没有做过什么事至今都不敢告诉任何人？"
]

dares = [
    "嗑药"
]



# Generate the formatted list
output = []

# Add truths
for i, truth in enumerate(truths, 1601):
    output.append({
        "id": str(i),
        "type": "TRUTH",
        "difficulty": "SIMPLE",
        "language": "MY",
        "content": truth
    })

# Add dares
for i, dare in enumerate(dares, len(truths) + 1601):
    output.append({
        "id": str(i),
        "type": "DARE",
        "difficulty": "SIMPLE",
        "language": "MY",
        "content": dare
    })

# Optional: Export to JSON file
with open("truth_or_dare_questions_simple_MY.json", "w") as f:
    json.dump(output, f, indent=2)
