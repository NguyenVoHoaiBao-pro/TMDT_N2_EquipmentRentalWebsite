import os
import pandas as pd

# BASE_DIR:
root_dir = os.path.dirname(os.path.dirname(__file__))
print(root_dir)

# DATA_DIR:
data_file = os.path.join(root_dir, "scrapped_data", "scrapped_camera_data.csv")
print(data_file)

df = pd.read_csv(data_file)
print(df.head())
print(df.columns)
