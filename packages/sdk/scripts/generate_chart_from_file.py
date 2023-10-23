import matplotlib.pyplot as plt
import numpy as np
import json
import sys
import os
from collections import defaultdict

def generate_colors(num_colors):
    cm = plt.get_cmap('tab10') # 'tab10' is just one of the many available color maps.
    color_list = [cm(1.*i/num_colors) for i in range(num_colors)]
    return color_list

colors = generate_colors(10)

def plot_chart_from_file(filename):
    # Read data from the provided file
    with open(filename, 'r') as f:
        data = json.load(f)

    # Group data by label
    data_grouped_by_label = defaultdict(list)
    for entry in data:
        data_grouped_by_label[entry["label"]].append(entry["duration"])

    plt.figure(figsize=(10, 6))

    for i, (label, durations) in enumerate(data_grouped_by_label.items()):
        plt.plot(durations, label=label, color=colors[i % len(colors)], marker='o', linestyle='-')

    plt.xlabel('Data Point Index')  # Changed from 'Label' as the x-axis now represents index of data points for each label
    plt.ylabel('Duration')
    plt.title('Duration for Each Label')
    plt.legend()
    plt.tight_layout()

    # Save the plot as a PNG
    base_filename = os.path.splitext(os.path.basename(filename))[0]
    output_filename = base_filename + '.png'
    plt.savefig(output_filename)

    # Echo the saved filename
    print(f"Chart saved to: {output_filename}")

if __name__ == "__main__":
    # Check if filename is provided as an argument
    if len(sys.argv) != 2:
        print("Usage: python generate_chart_from_file.py <filename>")
        sys.exit(1)

    filename = sys.argv[1]
    plot_chart_from_file(filename)
