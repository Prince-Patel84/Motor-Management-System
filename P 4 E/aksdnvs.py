import pandas as pd
import os

# Path to the Excel file
EXCEL_FILE = 'motors.xlsx'

def create_test_data():
    data = []
    for i in range(1, 11):  # Adding 10 test entries
        motor = {
            'Equipment ID No': f'Ein{i}',
            'Location': f'Loc{i}',
            'Use Of Motor': f'Use{i}',
            'Serial No.': f'SN00{i}',
            'SPM No.': f'SPM00{i}',
            'KW': 5.0 + i,  # Example increment
            'FLC': 10 + i,
            'RPM': 1500 + (i * 100),
            'Volt': 200 + i,
            'Frame Size': f'{i*5}x{i*4}',
            'Fan Details': f'Detail{i}',
            'Make': f'Make{i}',
            'Duty': f'Duty{i}',
            'Insulation': f'Ins{i}',
            'Bearing (DE)': f'BEARING{i}',
            'Bearing (NDE)': f'BEARING{i+1}',
            'Cooling Fan': 'Yes' if i % 2 == 0 else 'No',
            'IP': f'{i}{i}',
            'Oil Seal': f'Seal{i}',
            'TB Box':f'Box{i}',
            'Fan Cover': f'Cover{i}',
            'TB Block': f'Terminal{i}',
            'Mounting': f'Mount{i}',
            'OH Date': f'2024-0{i}-01',
            'Job Description': f'Description Of Motor{i}',
            'R': 'Yes' if i % 2 != 0 else 'No',
            'Y': 'Yes' if i % 2 == 0 else 'No',
            'B': 'Yes' if i % 3 == 0 else 'No'
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
