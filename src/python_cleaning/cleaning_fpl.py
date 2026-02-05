"""
**Author**:
    Fitz Koch
**Created**:
    2026-01-30
**Description**:
    Cleans fpl from https://dcf.vermont.gov/benefits/3SquaresVT/income-guidelines#Allowable
"""

import pandas as pd


def remove_dollars(df: pd.DataFrame, column_names: list[str]):
    """
    Given a column of money strings (in dollars, with commas or decimals),
    removes commas and decimals.
    NOTE: mutates dataframe in place.
    """
    for column_name in column_names:
        df[column_name].fillna(0)
        df[column_name] = (
            df[column_name]
            .astype(str)
            .str.replace(r"[,$]", "", regex=True)
            .astype(float)
            .astype(int)
        )


def clean_threesquares_df():
    """
    Hardcoded clean of federal poverty limit df from
    https://dcf.vermont.gov/benefits/3SquaresVT/income-guidelines.
    """
    df = pd.read_csv("src/data/fpl/fpl-snap_2-1-2026_raw.csv", index_col=False)
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
    remove_dollars(
        df,
        [
            "Gross Monthly Income Limit",
            "Net Monthly Income Limit",
            "Maximum Monthly Benefit",
        ],
    )
    df.to_csv("src/data/fpl/fpl-monthly-2-1-2026_clean.csv", index=False)


def clean_dynosaur_df():
    """Hardcoded clean of federal poverty limit info from
    https://info.healthconnect.vermont.gov/compare-plans/medicaid-and-dr-dynasaur
    """
    df = pd.read_csv("src/data/fpl/fpl-dynosaur_2-1-2026_raw.csv")
    df.rename(
        inplace=True,
        columns={
            "Household Size*": "Household Size",
            "$0 Premium": "0 Premium",
            "$15 premium per family per month": "15 Premium",
            "$20 premium per family, per month if child(ren) have other insurance. $60 premium per family, per month if child(ren) are uninsured": "20-60 Premium",
        },
    )
    remove_dollars(df, ["0 Premium", "15 Premium", "20-60 Premium"])
    df.to_csv("src/data/fpl/fpl-dynosaur_2-1-2026_clean.csv", index=False)


def clean_medicaid_df():
    """Source:
    https://info.healthconnect.vermont.gov/sites/vhc/files/documents/2025-MCA-FPL-Chart.pdf
    """
    df = pd.read_csv("src/data/fpl/medicaid-full_2-1-2026_raw.csv")
    remove_dollars(df, ["Medicaid for Adults", "Pregnant Women", "Children Under 19"])
    df.to_csv("src/data/fpl/medicaid-full_2-1-2026_clean.csv", index=False)


def clean_ccfap_asst_guidelines():
    df = pd.read_csv("src/data/ccfap/ccfap-asst-guidelines_3-1-25.csv")
    remove_dollars(
        df,
        [
            # "Household Size",
            "Gross Monthly Income",
            "Weekly Family Share",
        ],
    )
    df = df.drop(columns="Federal Poverty Level")

    grouped = df.groupby("Household Size")
    for size, group in grouped:
        print(f"{size} : [")
        for _, row in group.iterrows():
            print(
                f"    {{ maxIncome: {row['Gross Monthly Income']}, weeklyCopay: {row['Weekly Family Share']} }},"
            )
        print("  ],")


if __name__ == "__main__":
    clean_ccfap_asst_guidelines()
    # clean_threesquares_df()
    # clean_dynosaur_df()
    # clean_medicaid_df()
