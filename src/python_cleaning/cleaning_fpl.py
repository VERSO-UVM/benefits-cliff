"""
**Author**:
    Fitz Koch
**Created**:
    2026-01-30
**Description**:
    Cleans fpl from https://dcf.vermont.gov/benefits/3SquaresVT/income-guidelines#Allowable
"""

import pandas as pd


def remove_dollars(df: pd.DataFrame, column_name: str):
    """
    Given a column of money strings (in dollars, with commas or decimals),
    removes commas and decimals.
    NOTE: mutates dataframe in place.
    """
    df[column_name] = (
        df[column_name].astype(str).str.replace(r"[^\d]", "", regex=True).astype(int)
    )


def clean_fpl_df():
    """
    Hardcoded clean of federal poverty limit df from https://dcf.vermont.gov/benefits/3SquaresVT/income-guidelines.
    """
    df = pd.read_csv("src/data/fpl-monthly-2025_raw.csv", index_col=False)
    remove_dollars(df, "Expanded Gross Monthly Income (185% of FPL)")
    remove_dollars(df, "Maximum Net Monthly Income (100% of FPL)")
    df.to_csv("src/data/fpl-monthly-2025_clean.csv", index=False)


if __name__ == "__main__":
    clean_fpl_df()
