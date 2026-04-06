/**
 * PDF Generation & Data Cleanup Utility for UOE
 * 1. Generates Landscape PDF
 * 2. Deletes records from 'student_marks' table in 'academic_performance_db'
 * 3. Clears the HTML table for the next user
 */
async function exportTableToPDF(tableId, classInfoId, teacherInfoId) {
    const { jsPDF } = window.jspdf;
    
    // Create Landscape PDF
    const doc = new jsPDF('l', 'pt', 'a4');

    // 1. Get Header Data
    const classInfo = document.getElementById(classInfoId).textContent;
    const teacherInfo = document.getElementById(teacherInfoId).textContent;

    // 2. Format PDF Header
    doc.setFontSize(20);
    doc.setTextColor(41, 128, 185); 
    doc.text("University of Education (UOE)", 40, 45);
    
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(classInfo, 40, 75);
    doc.text(teacherInfo, 40, 90);

    // 3. Generate Table in PDF
    doc.autoTable({
        html: `#${tableId}`,
        startY: 110,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 5 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        didParseCell: function (data) {
            if (data.column.index === 12 && data.section === 'body') {
                data.cell.styles.textColor = (data.cell.text[0] === 'Fail') ? [231, 76, 60] : [39, 174, 96];
            }
        }
    });

    // 4. Trigger Download
    const subjectName = classInfo.split('|')[0].replace('Subject: ', '').trim();
    doc.save(`UOE_Result_${subjectName}.pdf`);

    // 5. DATABASE & UI CLEANUP
    // We use a small timeout to ensure the PDF download starts before the alert/delete happens
    setTimeout(async () => {
        const confirmClear = confirm("PDF Generated! Would you like to CLEAR the database and table for the next entry?");
        
        if (confirmClear) {
            try {
                // Call your backend delete route
                const response = await fetch("http://localhost:3000/clear-results", {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    // Clear the frontend table rows
                    const resultBody = document.getElementById('resultBody');
                    if (resultBody) {
                        resultBody.innerHTML = "<tr><td colspan='15' style='text-align:center; color:gray; padding:20px;'>Database cleared. Ready for next session.</td></tr>";
                    }
                    alert("Success: Database cleared and table reset.");
                } else {
                    alert("Error: PDF saved, but the database could not be cleared. Check backend route /clear-results.");
                }
            } catch (err) {
                console.error("Cleanup failed:", err);
                alert("Connection Error: Could not reach the server to clear data.");
            }
        }
    }, 500);
}