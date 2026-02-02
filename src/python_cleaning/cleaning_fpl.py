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
    Hardcoded clean of federal poverty limit df from
    https://dcf.vermont.gov/benefits/3SquaresVT/income-guidelines.
    """
    df = pd.read_csv("src/data/fpl/fpl-annual_2-1-2026_raw.csv", index_col=False)
    df.rename(
        inplace=True,
        columns={
            "FS House-hold Size": "Household Size",
            "Gross Monthly Income Limit (185%FPL)": "Gross Monthly Income Limit",
            "Gross Monthly Income Limit (165% FPL)": "Drop1",
            "Gross Monthly Income Limit (130% FPL)": "Drop2",
            "Net Monthly Income Limit (100% FPL)": "Net Monthly Income Limit",
        },
    )

    df.drop(inplace=True, columns={"Drop1", "Drop2"})
    remove_dollars(df, "Gross Monthly Income Limit")
    remove_dollars(df, "Net Monthly Income Limit")
    remove_dollars(df, "Maximum Monthly Benefit")
    df.to_csv("src/data/fpl/fpl-monthly-2-1-2026_clean.csv", index=False)


if __name__ == "__main__":
    clean_fpl_df()
