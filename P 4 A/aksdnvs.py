import pandas as pd
import os

# Path to the Excel file
EXCEL_FILE = 'motors.xlsx'

def create_test_data():
    data = []
    for i in range(1, 11):  # Adding 10 test entries
        motor = {
            'Location': f'Loc{i}',
            'Use Of Motor': f'Use{i}',
            'Serial No.': f'SN00{i}',
            'SPM No.': f'SPM00{i}',
            'KW': 5.0 + i,  # Example increment
            'FLC': 10 + i,
            'RPM': 1500 + (i * 100),
            'Fr. Size': f'Size{i}',
            'Make': f'Make{i}',
            'Bearing (DE)': f'BEARING{i}',
            'Bearing (NDE)': f'BEARING{i+1}',
            'Cooling Fan': 'Yes' if i % 2 == 0 else 'No',
            'Fan Cover': f'Cover{i}',
            'Terminal Block': f'Terminal{i}',
            'Mounting': f'Mount{i}',
            'O/H (DATE)': f'2024-0{i}-01'
        }
        data.append(motor)
    return data

def write_motors_to_excel(motors):
    df = pd.DataFrame(motors)
    try:
        df.to_excel(EXCEL_FILE, index=False)
        print(f"Data written to {EXCEL_FILE}")
    except Exception as e:
        print(f"Error writing to Excel file: {e}")

if __name__ == '__main__':
    motors = create_test_data()
    write_motors_to_excel(motors)
